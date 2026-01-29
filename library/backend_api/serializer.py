from rest_framework import serializers
from .models import Books, Authors, BookCategories, UserProfile, Diaries
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.authtoken.models import Token


class BooksSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    author_slug = serializers.SlugField(source="author.slug", read_only=True)
    genre = serializers.CharField(source="category.cat", read_only=True)
    is_favorite = serializers.SerializerMethodField()
    
    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_favorited_by(request.user)
        return False

    class Meta:
        model = Books
        fields = ['id', 'title', 'slug', 'author_id', 'author_name', 'genre', 'author_slug', 'is_favorite']

class DiariesSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    # user_last_name = serializers.CharField(source="user.last_name", read_only=True)
    # user_first_name = serializers.CharField(source="user.first_name", read_only=True)

    class Meta:
        model = Diaries
        fields = ['id', 'title', 'slug', 'description', 'username']

from rest_framework import serializers
from .models import Diaries

class DiarySerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Diaries
        fields = [
            'id', 
            'title', 
            'slug', 
            'description', 
            'user', 
            'file',
            'file_url',
            'created_at'
        ]
        read_only_fields = ['slug', 'created_at', 'user']
    
    def get_file_url(self, obj):
        """Возвращает URL файла"""
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
    
    def validate(self, data):
        if 'file' not in data or not data['file']:
            raise serializers.ValidationError({
                "file": "Необходимо загрузить файл"
            })
        
        file = data.get('file')
        if file:
            allowed_extensions = ['.txt', '.pdf', '.doc', '.docx', '.md', '.zip']
            import os
            file_name = file.name.lower()
            
            if not any(file_name.endswith(ext) for ext in allowed_extensions):
                raise serializers.ValidationError({
                    "file": f"Неподдерживаемый тип файла. Разрешены: {', '.join(allowed_extensions)}"
                })
            
            max_size = 100 * 1024 * 1024
            if file.size > max_size:
                raise serializers.ValidationError({
                    "file": f"Файл слишком большой. Максимальный размер: {max_size // (1024*1024)}MB"
                })
        
        return data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class BookSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    author_slug = serializers.SlugField(source="author.slug", read_only=True)
    category = serializers.CharField(source="category.cat", read_only=True)
    download_url = serializers.SerializerMethodField()
    
    def get_download_url(self, obj):
        if obj.text_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(f'/book/{obj.slug}/download/')
        return None

    class Meta:
        model = Books
        fields = ['id', 'title', 'category', 'slug', 'author_slug', 'author_name', 'download_url']

class DiarySerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()
    def get_download_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(f'/diary/{obj.slug}/download/')
        return None
    username = serializers.CharField(source='user.username', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    
    class Meta:
        model = Diaries
        fields = ['id', 'title', 'slug', 'username', 'user_first_name', 'user_last_name', 'download_url']


class AuthorsSerializer(serializers.ModelSerializer):
    is_favorite = serializers.SerializerMethodField()
    
    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_favorited_by(request.user)
        return False

    class Meta:
        model = Authors
        fields = ["id", "name", 'slug', 'user_name', 'is_favorite']


class AuthorsBooksSerializer(serializers.ModelSerializer):
    books = BooksSerializer(many=True, read_only=True)

    class Meta:
        model = Authors
        fields = ['id', 'name', "slug", 'user_name', 'books']


class GenresSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCategories
        fields = ['cat', 'slug']


class UserSerializer(serializers.ModelSerializer):
    registration_complete = serializers.BooleanField(source='profile.registration_complete', read_only=True)
    patronymic = serializers.CharField(source='profile.patronymic', read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 
                 'is_staff', 'registration_complete', 'patronymic']
        read_only_fields = ['id', 'date_joined', 'is_staff', 'registration_complete', 'patronymic']


class FirstRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'password2']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            is_staff=False,
            email='',
            first_name='',
            last_name=''
        )
        
        Token.objects.create(user=user)
        
        return user


class CompleteRegistrationSerializer(serializers.ModelSerializer):
    patronymic = serializers.CharField(required=False, allow_blank=True, write_only=True)
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'patronymic']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
        }
    
    def validate_email(self, value):
        user = self.instance
        if User.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("Этот email уже используется")
        return value
    
    def update(self, instance, validated_data):
        patronymic = validated_data.pop('patronymic', None)
        
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        
        instance.is_staff = True
        
        instance.save()
        
        if hasattr(instance, 'profile'):
            if patronymic is not None:
                instance.profile.patronymic = patronymic
            instance.profile.registration_complete = True
            instance.profile.save()
        
        return instance


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    favorite_books = BooksSerializer(many=True, read_only=True, source='user.favorite_books')
    favorite_authors = AuthorsSerializer(many=True, read_only=True, source='user.favorite_authors')
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'patronymic', 'registration_complete', 'favorite_books', 'favorite_authors']

class RegistrationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_staff']
        read_only_fields = fields

class StaffUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']
        read_only_fields = fields

class UsersDiaries(serializers.ModelSerializer):
    diaries = DiariesSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', "first_name", 'last_name', 'diaries']
