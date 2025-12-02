from django.shortcuts import render
from rest_framework.views import APIView
from .models import Books
from .serializer import BooksSerializer
from rest_framework.response import Response

class BooksView(APIView):
    def get(self, request):
        output = []
        for out in Books.objects.all():
            output.append({"title":out.title, "author": out.author})
        return Response(output)
    
    def post(self, request):
        serializer = BooksSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)



