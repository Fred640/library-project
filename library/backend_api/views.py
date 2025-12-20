from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from .models import Books, Authors, BookCategories
from .serializer import BooksSerializer, AuthorsSerializer, AuthorsBooksSerializer, BookSerializer, GenresSerializer
from rest_framework.response import Response


class BooksView(APIView):
    def get(self, request):
        books = Books.objects.all()
        serializer = BooksSerializer(books, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = BooksSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        
class BookView(APIView):
    def get(self, request, book_slug):
        book = Books.objects.get(slug=book_slug)
        serializer = BookSerializer(book)
        return Response(serializer.data)

class AuthorsView(APIView):
    def get(self, request):
        authors = Authors.objects.all()
        serializer = AuthorsSerializer(authors, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = AuthorsSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        
class AuthorsBooks(APIView):
    def get(self, request, slug):
        author = get_object_or_404(
            Authors.objects.prefetch_related('books'), 
            slug=slug
        )
        serializer = AuthorsBooksSerializer(author)
        return Response(serializer.data)
    
class Genres(APIView):
    def get(self, request):
        genres = BookCategories.objects.all()
        serializer = GenresSerializer(genres, many=True)
        return Response(serializer.data)
