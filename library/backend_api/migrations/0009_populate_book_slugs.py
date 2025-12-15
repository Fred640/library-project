from django.db import migrations
from django.utils.text import slugify
import uuid

def generate_unique_slug(title, model_class, existing_slugs):
    """Генерирует уникальный slug"""
    base_slug = slugify(title)
    slug = base_slug
    counter = 1
    
    # Проверяем существование slug
    while slug in existing_slugs:
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    return slug

def populate_book_slugs(apps, schema_editor):
    Book = apps.get_model('backend_api', 'Books')
    existing_slugs = set()
    
    for book in Book.objects.filter(slug__isnull=False):
        existing_slugs.add(book.slug)
    
    books_without_slug = Book.objects.filter(slug__isnull=True)
    
    for book in books_without_slug:
        base_slug = slugify(book.title)
        
        slug = base_slug
        counter = 1
        
        while slug in existing_slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        book.slug = slug
        existing_slugs.add(slug)
        book.save(update_fields=['slug'])
        
        print(f"Updated book '{book.title}' with slug '{book.slug}'")

def reverse_populate_book_slugs(apps, schema_editor):
    """Обратная миграция - устанавливаем slug в NULL"""
    Book = apps.get_model('backend_api', 'Books')
    Book.objects.all().update(slug=None)

class Migration(migrations.Migration):
    dependencies = [
        ('backend_api','0008_books_slug_alter_books_title'),
    ]

    operations = [
        migrations.RunPython(
            populate_book_slugs,
            reverse_populate_book_slugs,
        ),
    ]