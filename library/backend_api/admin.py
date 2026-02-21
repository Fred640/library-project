from django.contrib import admin
from .models import Books, Authors, BookCategories, UserProfile, Diaries

@admin.register(Books)
class BookAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'author', 'category', 'slug']


@admin.register(Authors)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'user_name', 'slug']


@admin.register(BookCategories)
class BookCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'cat', 'slug']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'registration_complete']


@admin.register(Diaries)
class DiaryAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'user', 'slug']
