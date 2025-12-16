from rest_framework import serializers
from .models import Books, Authors


class BooksSerializer(serializers.ModelSerializer):

    author_name = serializers.CharField(source='author.name', read_only=True)
    author_slug = serializers.SlugField(source="author.slug", read_only=True)

    class Meta:
        model = Books
        fields = ['title', 'slug', 'author_id', 'author_name', 'genre', 'author_slug']

class BookSerializer(serializers.ModelSerializer):

    author_name = serializers.CharField(source='author.name', read_only=True)
    author_slug = serializers.SlugField(source="author.slug", read_only=True)

    class Meta:
        model = Books
        fields = ['id', 'title', 'genre', 'slug', 'author_slug', 'author_name']

class AuthorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Authors
        fields = ["id", "name", 'slug', 'user_name']

class AuthorsBooksSerializer(serializers.ModelSerializer):

    books = BooksSerializer(many=True, read_only=True)


    class Meta:
        model = Authors
        fields = ['id', 'name', "slug", 'user_name', 'books']
