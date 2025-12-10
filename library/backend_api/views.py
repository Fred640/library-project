from django.shortcuts import render
from rest_framework.views import APIView
from .models import Books, Authors
from .serializer import BooksSerializer, AuthorsSerializer
from rest_framework.response import Response


class BooksView(APIView):
    def get(self, request):
        books = Books.objects.all()
        serializer = BooksSerializer(books, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = BooksSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

class AuthorsView(APIView):
    def get(self, request):
        authors = Authors.objects.all()
        serializer = AuthorsSerializer(authors, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = AuthorsSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

