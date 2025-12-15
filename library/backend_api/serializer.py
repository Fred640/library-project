from rest_framework import serializers
from .models import Books, Authors


class BooksSerializer(serializers.ModelSerializer):

    author_id = serializers.IntegerField(source='author.id', read_only=True)
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = Books
        fields = ['title', 'author_id', 'author_name', 'genre']

class AuthorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Authors
        fields = ["id", "name", 'user_name']

class AuthorsBooksSerializer(serializers.ModelSerializer):

    books = BooksSerializer(many=True, read_only=True)


    class Meta:
        model = Authors
        fields = ['id', 'name', 'user_name', 'books']
