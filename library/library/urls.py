from django.contrib import admin
from django.urls import path, include
from django.urls import re_path
from backend_api.views import (
    BooksView, 
    AuthorsView, 
    AuthorsBooks, 
    BookView, 
    Genres, 
    DownloadBookView, 
    RegisterView,
    CompleteRegistrationView,
    LoginView, 
    LogoutView, 
    CurrentUserView,
    CheckAuthView,
    ToggleFavoriteBookView, 
    ToggleFavoriteAuthorView, 
    UserFavoritesView,
    RegistrationStatusView,
    DiariesView
    )
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', BooksView.as_view(), name="main"),
    path('authors/', AuthorsView.as_view(), name="authors"),
    path('author/<slug:slug>/', AuthorsBooks.as_view(), name="authorsbook"),
    path('book/<slug:book_slug>/', BookView.as_view(), name="book"),
    path('genres/', Genres.as_view(), name="genres"),
    path('book/<slug:book_slug>/download/', DownloadBookView.as_view(), name='download-book'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),
    path('auth/check/', CheckAuthView.as_view(), name='check_auth'),
    path('books/<int:book_id>/favorite/', ToggleFavoriteBookView.as_view(), name='toggle_favorite_book'),
    path('authors/<int:author_id>/favorite/', ToggleFavoriteAuthorView.as_view(), name='toggle_favorite_author'),
    path('user/favorites/', UserFavoritesView.as_view(), name='user_favorites'),
    path('registration-status/', RegistrationStatusView.as_view(), name='registration-status'),
    path('register/', RegisterView.as_view(), name='register'),
    path('auth/complete-registration/', CompleteRegistrationView.as_view(), name='complete-registration'),
    path('diaries', DiariesView.as_view())
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)