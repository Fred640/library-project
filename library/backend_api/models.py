from django.db import models

class Books(models.Model):
    title = models.CharField()
    author = models.ForeignKey("Authors", on_delete=models.PROTECT, related_name="books")

class Authors(models.Model):
    name = models.CharField(max_length=100)
    user_name = models.CharField(max_length=50, blank=True, null=True)
