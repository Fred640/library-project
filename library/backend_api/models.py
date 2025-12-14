from django.db import models

class Books(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey("Authors", on_delete=models.PROTECT, related_name="books")
    genre = models.CharField(max_length=100, blank=True, null=True)

class Authors(models.Model):
    name = models.CharField(max_length=100)
    user_name = models.CharField(max_length=50, blank=True, null=True)
