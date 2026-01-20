from django.contrib import admin
from .models import Books, Diaries

@admin.register(Books)
class BookAdmin(admin.ModelAdmin):
    list_display = ["title", 'author', 'slug', 'text_file']

admin.site.register(Diaries)