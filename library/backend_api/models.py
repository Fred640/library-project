from django.db import models

class Books(models.Model):
    title = models.CharField()
    author = models.CharField(max_length=100)

