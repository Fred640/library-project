from django.contrib import admin
from django.urls import path, include
from django.urls import re_path
from backend_api.views import BooksView, AuthorsView, AuthorsBooks


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', BooksView.as_view(), name="main"),
    path('authors/', AuthorsView.as_view(), name="authors"),
    path('author/<int:author_id>/', AuthorsBooks.as_view(), name="authorsbook")
]
