from django.db import models
from django.utils.text import slugify
import os

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
    """
    Сокращаем имя файла перед сохранением
    """
    author_slug = instance.author.slug
    book_slug = instance.slug
    
    file_ext = os.path.splitext(filename)[1]
    short_filename = f"{book_slug}{file_ext}"
    
    return os.path.join('books', author_slug, book_slug, short_filename)

class Authors(models.Model):
    name = models.CharField(max_length=100)
    user_name = models.CharField(max_length=50, blank=True, null=True)
    slug = models.SlugField(unique=True, max_length=100, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify_ru(self.name)
            self.slug = base_slug
            counter = 1
            while Authors.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{base_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

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