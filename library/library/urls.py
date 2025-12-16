from django.contrib import admin
from django.urls import path, include
from django.urls import re_path
from backend_api.views import BooksView, AuthorsView, AuthorsBooks, BookView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', BooksView.as_view(), name="main"),
    path('authors/', AuthorsView.as_view(), name="authors"),
    path('author/<slug:slug>/', AuthorsBooks.as_view(), name="authorsbook"),
    path('book/<slug:book_slug>/', BookView.as_view(), name="book")
]
