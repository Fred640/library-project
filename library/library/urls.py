from django.contrib import admin
from django.urls import path, include
from django.urls import re_path
from backend_api.views import BooksView, AuthorsView, AuthorsBooks, BookView, Genres, DownloadBookView
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
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)