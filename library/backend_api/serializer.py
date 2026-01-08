from rest_framework import serializers
from .models import Books, Authors, BookCategories, UserProfile
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

class BookSerializer(serializers.ModelSerializer):

    author_name = serializers.CharField(source='author.name', read_only=True)
    author_slug = serializers.SlugField(source="author.slug", read_only=True)
    category = serializers.CharField(source="category.cat", read_only=True)

    download_url = serializers.SerializerMethodField()
    def get_download_url(self, obj):
        if obj.text_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(
                    f'/book/{obj.slug}/download/'
                )
        return None


    class Meta:
        model = Books
        fields = ['id', 'title', 'category', 'slug', 'author_slug', 'author_name', 'download_url']

class AuthorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Authors
        fields = ["id", "name", 'slug', 'user_name',]

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
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined')
        read_only_fields = ('id', 'date_joined')

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Этот email уже используется"})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        return user
    

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()



class UserProfileSerializer(serializers.ModelSerializer):
    favorite_books = BooksSerializer(many=True, read_only=True, source='user.favorite_books')
    favorite_authors = AuthorsSerializer(many=True, read_only=True, source='user.favorite_authors')
    
    class Meta:
        model = UserProfile
        fields = ['id', 'favorite_books', 'favorite_authors']