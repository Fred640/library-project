from django.shortcuts import render, get_object_or_404
from django.http import FileResponse, Http404
from rest_framework.views import APIView
from .models import Books, Authors, BookCategories
from .serializer import BooksSerializer, AuthorsSerializer, AuthorsBooksSerializer, BookSerializer, GenresSerializer
from rest_framework.response import Response
import os



class DownloadBookView(APIView):
    def get(self, request, book_slug):
        """Скачивание файла книги"""
        book = get_object_or_404(Books, slug=book_slug)
        

        if not book.text_file:
            return Response(
                {"error": "Файл книги не найден"}, 
                status=404
            )
        

        file_path = book.text_file.path
        
        if not os.path.exists(file_path):
            return Response(
                {"error": "Файл не найден на сервере"}, 
                status=404
            )
        

        try:
            response = FileResponse(
                open(file_path, 'rb'),
                as_attachment=True,
                filename=f"{book.slug}{os.path.splitext(file_path)[1]}"
            )
            

            if file_path.endswith('.pdf'):
                response['Content-Type'] = 'application/pdf'
            elif file_path.endswith('.txt'):
                response['Content-Type'] = 'text/plain'
            elif file_path.endswith('.epub'):
                response['Content-Type'] = 'application/epub+zip'
            elif file_path.endswith('.fb2'):
                response['Content-Type'] = 'application/xml'
            else:
                response['Content-Type'] = 'application/octet-stream'
            
            return response
            
        except Exception as e:
            return Response(
                {"error": f"Ошибка при чтении файла: {str(e)}"}, 
                status=500
            )

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
        serializer = BookSerializer(book, context={'request': request})  # Добавьте context
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
