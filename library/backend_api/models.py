from django.db import models
from autoslug import AutoSlugField
from .utils.slugify import slugify_ru

class Books(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey("Authors", on_delete=models.PROTECT, related_name="books")
    slug = AutoSlugField(
        populate_from='title',
        unique=True,
        slugify=slugify_ru,
        blank=True,
        null=True
    )

    def __str__(self):
        return self.title
    category = models.ForeignKey("BookCategories", on_delete=models.PROTECT, related_name="books", blank=True, null=True)


    

class Authors(models.Model):
    name = models.CharField(max_length=100)
    user_name = models.CharField(max_length=50, blank=True, null=True)
    slug = AutoSlugField(populate_from="name", unique=True, slugify=slugify_ru)

class BookCategories(models.Model):
    cat = models.CharField(max_length=100)
    slug = AutoSlugField(populate_from="cat", unique=True, slugify=slugify_ru)