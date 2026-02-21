# management/commands/convert_fb2.py
import os
import chardet
from django.core.management.base import BaseCommand
from django.core.files import File
from backend_api.models import Books, Diaries

class Command(BaseCommand):
    help = 'Конвертирует все FB2 файлы в UTF-8'

    def handle(self, *args, **options):
        # Конвертируем книги
        books = Books.objects.filter(text_file__isnull=False)
        for book in books:
            if book.text_file.name.endswith('.fb2'):
                self.convert_file(book.text_file)
        
        # Конвертируем дневники
        diaries = Diaries.objects.filter(file__isnull=False)
        for diary in diaries:
            if diary.file.name.endswith('.fb2'):
                self.convert_file(diary.file)
    
    def convert_file(self, file_field):
        file_path = file_field.path
        self.stdout.write(f"Конвертация: {file_path}")
        
        with open(file_path, 'rb') as f:
            content = f.read()
        
        encoding = chardet.detect(content)['encoding'] or 'windows-1251'
        
        if encoding.lower() not in ['utf-8', 'ascii']:
            try:
                decoded = content.decode(encoding)
                
                # Заменяем объявление кодировки в XML
                if '<?xml' in decoded[:100]:
                    import re
                    decoded = re.sub(
                        r'encoding=["\'].*?["\']',
                        'encoding="utf-8"',
                        decoded,
                        count=1
                    )
                
                # Сохраняем обратно
                with open(file_path, 'wb') as f:
                    f.write(decoded.encode('utf-8'))
                
                self.stdout.write(self.style.SUCCESS(f"✅ Конвертирован: {file_path}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Ошибка: {file_path} - {e}"))