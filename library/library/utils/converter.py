import chardet
from django.core.files.base import ContentFile
import os

def convert_fb2_to_utf8(file_obj):
    content = file_obj.read()
    encoding = chardet.detect(content)['encoding'] or 'windows-1251'
    
    try:
        decoded_content = content.decode(encoding)
    
        if '<?xml' in decoded_content[:100]:
            import re
            decoded_content = re.sub(
                r'encoding=["\'].*?["\']', 
                'encoding="utf-8"', 
                decoded_content, 
                count=1
            )
        
        utf8_content = decoded_content.encode('utf-8')
        
        new_file = ContentFile(utf8_content)
        new_file.name = file_obj.name
        
        return new_file
        
    except Exception as e:
        return file_obj