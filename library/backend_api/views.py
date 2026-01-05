from django.shortcuts import render, get_object_or_404
from django.http import FileResponse, Http404
from rest_framework.views import APIView
from .models import Books, Authors, BookCategories
from .serializer import BooksSerializer, AuthorsSerializer, AuthorsBooksSerializer, BookSerializer, GenresSerializer, RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework.response import Response
import os
from rest_framework.authtoken.models import Token
from rest_framework import generics, permissions, status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User



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
    

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            "user": {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            },
            "token": token.key,
            "message": "Пользователь успешно зарегистрирован"
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            
            login(request, user)
            
            return Response({
                "user": UserSerializer(user).data,
                "token": token.key,
                "message": "Успешный вход"
            })
        else:
            return Response(
                {"error": "Неверное имя пользователя или пароль"},
                status=status.HTTP_401_UNAUTHORIZED
            )

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, Token.DoesNotExist):
            pass
        
        logout(request)
        
        return Response({"message": "Успешный выход"}, status=status.HTTP_200_OK)

class CurrentUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class CheckAuthView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request):
        return Response({"authenticated": True, "user": UserSerializer(request.user).data})
