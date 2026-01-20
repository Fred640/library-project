from django.db import models
from django.utils.text import slugify
import os
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

def cyrillic_to_latin(text):
    cyrillic = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
    latin = 'a,b,v,g,d,e,yo,zh,z,i,y,k,l,m,n,o,p,r,s,t,u,f,kh,ts,ch,sh,shch,,y,,e,yu,ya'.split(',')
    
    translit_dict = dict(zip(cyrillic, latin))
    translit_dict.update({
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
        'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
        'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
        'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
        'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    })
    
    result = []
    for char in text:
        if char in translit_dict:
            result.append(translit_dict[char])
        else:
            result.append(char)
    
    return ''.join(result)

def slugify_ru(text):
    """Транслитерация + slugify"""
    text = cyrillic_to_latin(text)
    return slugify(text)

def book_file_path(instance, filename):
    """
    Файлы будут сохраняться в:
    media/books/{author_slug}/{book_slug}/{filename}
    """
    author_slug = instance.author.slug
    book_slug = instance.slug
    
    file_ext = os.path.splitext(filename)[1]
    short_filename = f"{book_slug}{file_ext}"
    
    return os.path.join('books', author_slug, book_slug, short_filename)


def diary_file_path(instance, filename):
    """
    Файлы будут сохраняться в:
    media/diary/{username}/{diary_slug}/{filename}
    """
    username = instance.user.username
    diary_slug = instance.slug
    
    file_ext = os.path.splitext(filename)[1]
    short_filename = f"{diary_slug}{file_ext}"
    
    return os.path.join('diaries', username, diary_slug, short_filename)

class Authors(models.Model):
    name = models.CharField(max_length=100)
    user_name = models.CharField(max_length=50, blank=True, null=True)
    slug = models.SlugField(unique=True, max_length=100, blank=True)
    
    favorited_by = models.ManyToManyField(
        User, 
        related_name='favorite_authors',
        blank=True
    )
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify_ru(self.name)
            self.slug = base_slug
            counter = 1
            while Authors.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{base_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    def is_favorited_by(self, user):
        """Проверяет, добавил ли пользователь автора в избранное"""
        if not user.is_authenticated:
            return False
        return self.favorited_by.filter(id=user.id).exists()

class BookCategories(models.Model):
    cat = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=100, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify_ru(self.cat)
            self.slug = base_slug
            counter = 1
            while BookCategories.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{base_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.cat

class Books(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey("Authors", on_delete=models.PROTECT, related_name="books")
    slug = models.SlugField(unique=True, max_length=200, blank=True, null=True)
    text_file = models.FileField(
        upload_to=book_file_path,
        blank=True,
        null=True,
        max_length=500
    )
    category = models.ForeignKey("BookCategories", on_delete=models.PROTECT, related_name="books", blank=True, null=True)
    
    favorited_by = models.ManyToManyField(
        User, 
        related_name='favorite_books',
        blank=True
    )
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify_ru(self.title)
            self.slug = base_slug
            counter = 1
            while Books.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{base_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)
    
    def is_favorited_by(self, user):
        """Проверяет, добавил ли пользователь книгу в избранное"""
        if not user.is_authenticated:
            return False
        return self.favorited_by.filter(id=user.id).exists()

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    patronymic = models.CharField(
        max_length=100, 
        blank=True,
        null=True,
    )
    registration_complete = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Профиль {self.user.username}"
    
    def get_favorite_books(self):
        """Получить любимые книги пользователя"""
        return self.user.favorite_books.all()
    
    def get_favorite_authors(self):
        """Получить любимых авторов пользователя"""
        return self.user.favorite_authors.all()
    
    def complete_registration(self, first_name, last_name, email, patronymic=None):
        """
        Завершение регистрации пользователя
        Устанавливает is_staff=True при успешном завершении
        """
        self.user.first_name = first_name
        self.user.last_name = last_name
        self.user.email = email
        
        if patronymic:
            self.patronymic = patronymic
        
        self.user.is_staff = True
        self.registration_complete = True
        
        self.user.save()
        self.save()
        
        return self

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Автоматически создаем профиль при создании пользователя"""
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Автоматически сохраняем профиль при сохранении пользователя"""
    if hasattr(instance, 'profile'):
        instance.profile.save()

class Diaries(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250, blank=True, null=True)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="diaries")
    file = models.FileField(upload_to=diary_file_path, blank=True, null=True)
    favorited_by = models.ManyToManyField(
        User, 
        related_name='favorite_diaries',
        blank=True
    )


    def is_favorited_by(self, user):
        if not user.is_authenticated:
            return False
        return self.favorited_by.filter(id=user.id).exists()

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify_ru(self.title)
            self.slug = base_slug
            counter = 1
            while Diaries.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{base_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)
