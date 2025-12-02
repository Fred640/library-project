from django.contrib import admin
from django.urls import path, include
from django.urls import re_path
from backend_api.views import BooksView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', BooksView.as_view(), name="main")
]
