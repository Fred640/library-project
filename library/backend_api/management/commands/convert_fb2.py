import os
import chardet
import re
from django.core.management.base import BaseCommand
from backend_api.models import Books, Diaries

class Command(BaseCommand):
    help = 'Конвертирует все FB2 файлы в UTF-8'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("=" * 60))
        self.stdout.write(self.style.SUCCESS("КОНВЕРТАЦИЯ FB2 ФАЙЛОВ В UTF-8"))
        self.stdout.write(self.style.SUCCESS("=" * 60))
        
        books = Books.objects.filter(text_file__isnull=False)
        self.stdout.write(f"\n📚 Найдено книг: {books.count()}")
        
        converted_books = 0
        for book in books:
            if book.text_file and book.text_file.name.lower().endswith('.fb2'):
                file_path = book.text_file.path
                self.stdout.write(f"\n  📖 {book.title}")
                
                if self.convert_file(file_path):
                    converted_books += 1
        
        diaries = Diaries.objects.filter(file__isnull=False)
        self.stdout.write(f"\nНайдено дневников: {diaries.count()}")
        
        converted_diaries = 0
        for diary in diaries:
            if diary.file and diary.file.name.lower().endswith('.fb2'):
                file_path = diary.file.path
                self.stdout.write(f"\n  📓 {diary.title}")
                
                if self.convert_file(file_path):
                    converted_diaries += 1
        
        self.stdout.write(self.style.SUCCESS("\n" + "=" * 60))
        self.stdout.write(self.style.SUCCESS(f"КОНВЕРТИРОВАНО: книг {converted_books}, дневников {converted_diaries}"))
        self.stdout.write(self.style.SUCCESS("=" * 60))
    
    def convert_file(self, file_path):
        try:
            if not os.path.exists(file_path):
                self.stdout.write(self.style.ERROR(f"Файл не найден: {file_path}"))
                return False
            
            with open(file_path, 'rb') as f:
                content = f.read()
            
            encoding = chardet.detect(content)['encoding'] or 'windows-1251'
            self.stdout.write(f"Кодировка: {encoding}")
            
            if encoding.lower() not in ['utf-8', 'ascii']:
                decoded = content.decode(encoding)
                if '<?xml' in decoded[:200]:
                    decoded = re.sub(
                        r'encoding=["\'].*?["\']',
                        'encoding="utf-8"',
                        decoded,
                        count=1
                    )
                
                with open(file_path, 'wb') as f:
                    f.write(decoded.encode('utf-8'))
                
                self.stdout.write(self.style.SUCCESS("Конвертирован"))
                return True
            else:
                self.stdout.write(self.style.SUCCESS("Уже в UTF-8"))
                return False
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Ошибка: {e}"))
            return False