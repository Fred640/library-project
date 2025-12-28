from rest_framework import serializers
from .models import Books, Authors, BookCategories


class BooksSerializer(serializers.ModelSerializer):

    author_name = serializers.CharField(source='author.name', read_only=True)
    author_slug = serializers.SlugField(source="author.slug", read_only=True)
    genre = serializers.CharField(source="category.cat", read_only=True)

    

    class Meta:
        model = Books
        fields = ['title', 'slug', 'author_id', 'author_name', 'genre', 'author_slug']

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
        fields = ["id", "name", 'slug', 'user_name']

class AuthorsBooksSerializer(serializers.ModelSerializer):

    books = BooksSerializer(many=True, read_only=True)


    class Meta:
        model = Authors
        fields = ['id', 'name', "slug", 'user_name', 'books']


class GenresSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCategories
        fields = ['cat', 'slug']
