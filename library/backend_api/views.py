from django.shortcuts import render, get_object_or_404
from django.http import FileResponse, Http404
from rest_framework.views import APIView
from .models import Books, Authors, BookCategories, Diaries
from rest_framework.response import Response
import os
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework import generics, permissions, status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser
import logging
from .serializer import (BooksSerializer, 
                         AuthorsSerializer, 
                         AuthorsBooksSerializer, 
                         BookSerializer, 
                         GenresSerializer, 
                         LoginSerializer, 
                         UserSerializer, 
                         FirstRegisterSerializer, 
                         CompleteRegistrationSerializer, 
                         DiariesSerializer, 
                         StaffUserSerializer, 
                         UsersDiaries,
                         DiarySerializer,
                         DiaryCreateSerializer)

logger = logging.getLogger(__name__)

class DiaryCreateView(generics.CreateAPIView):
    queryset = Diaries.objects.all()
    serializer_class = DiaryCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def create(self, request, *args, **kwargs):

        if 'file' not in request.FILES:
            return Response(
                {"error": "Файл обязателен для загрузки"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        diary = serializer.save()
        read_serializer = DiarySerializer(diary, context={'request': request})
        
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)

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
        serializer = BookSerializer(book, context={'request': request})
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
    serializer_class = FirstRegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Регистрация успешна. Завершите регистрацию для получения доступа к дополнительным функциям.'
        }, status=status.HTTP_201_CREATED)
    
class CompleteRegistrationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        if request.user.is_staff:
            return Response({
                'error': 'Регистрация уже завершена'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CompleteRegistrationSerializer(
            request.user, 
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': UserSerializer(user).data,
                'message': 'Регистрация успешно завершена. Теперь у вас есть доступ к дополнительным функциям.'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    
class ToggleFavoriteBookView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, book_id):
        try:
            book = Books.objects.get(id=book_id)
        except Books.DoesNotExist:
            return Response(
                {"error": "Книга не найдена"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if book.favorited_by.filter(id=request.user.id).exists():
            book.favorited_by.remove(request.user)
            return Response({
                "status": "removed",
                "message": "Книга удалена из избранного"
            })
        else:
            book.favorited_by.add(request.user)
            return Response({
                "status": "added",
                "message": "Книга добавлена в избранное"
            })

class ToggleFavoriteAuthorView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, author_id):
        try:
            author = Authors.objects.get(id=author_id)
        except Authors.DoesNotExist:
            return Response(
                {"error": "Автор не найден"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if author.favorited_by.filter(id=request.user.id).exists():
            author.favorited_by.remove(request.user)
            return Response({
                "status": "removed",
                "message": "Автор удален из избранного"
            })
        else:
            author.favorited_by.add(request.user)
            return Response({
                "status": "added",
                "message": "Автор добавлен в избранное"
            })
    
class UserFavoritesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        favorite_books = user.favorite_books.all()
        favorite_authors = user.favorite_authors.all()
        favorite_diaries = user.favorite_diaries.all()
        
        book_serializer = BooksSerializer(favorite_books, many=True, context={'request': request})
        author_serializer = AuthorsSerializer(favorite_authors, many=True, context={'request': request})
        diary_serializer = DiariesSerializer(favorite_diaries, many=True, context={"request":request})
        
        return Response({
            "favorite_books": book_serializer.data,
            "favorite_authors": author_serializer.data,
            "favorite_diaries": diary_serializer.data,
        })
    

    
class RegistrationStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        return Response({
            'registration_complete': request.user.is_staff,
            'has_profile': hasattr(request.user, 'profile'),
            'user': UserSerializer(request.user).data
        })
    
class DiariesView(APIView):
    def get(self, request):
        diaries = Diaries.objects.all()
        serializer = DiariesSerializer(diaries, many=True)
        return Response(serializer.data)
    
class StaffUsersView(APIView):
    def get(self, request):
        staff_users = User.objects.filter(is_staff=True, is_superuser=False)
        serializer = StaffUserSerializer(staff_users, many=True)
        return Response(serializer.data)


class UserDiariesView(APIView):
    def get(self, request, username):
        user = get_object_or_404(
            User.objects.prefetch_related('diaries'), 
            username=username
        )
        serializer = UsersDiaries(user, context={"request":request})
        return Response(serializer.data)

class DiaryView(APIView):
    def get(self, request, diary_slug):
        diary = get_object_or_404(Diaries, slug=diary_slug)
        serializer = DiarySerializer(diary, context={'request': request})
        return Response(serializer.data)
    




class DownloadDiaryView(APIView):
    def get(self, request, diary_slug):
        diary = get_object_or_404(Diaries, slug=diary_slug)
        

        if not diary.file:
            return Response(
                {"error": "Файл дневника не найден"}, 
                status=404
            )
        

        file_path = diary.file.path
        
        if not os.path.exists(file_path):
            return Response(
                {"error": "Файл не найден на сервере"}, 
                status=404
            )
        

        try:
            response = FileResponse(
                open(file_path, 'rb'),
                as_attachment=True,
                filename=f"{diary.slug}{os.path.splitext(file_path)[1]}"
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
        
class ToggleFavoriteDiaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, diary_id):
        try:
            diary = Diaries.objects.get(id=diary_id)
        except Diaries.DoesNotExist:
            return Response(
                {"error": "Дневник не найден"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if diary.favorited_by.filter(id=request.user.id).exists():
            diary.favorited_by.remove(request.user)
            return Response({
                "status": "removed",
                "message": "Дневник удалена из избранного"
            })
        else:
            diary.favorited_by.add(request.user)
            return Response({
                "status": "added",
                "message": "Денвник добавлена в избранное"
            })
        