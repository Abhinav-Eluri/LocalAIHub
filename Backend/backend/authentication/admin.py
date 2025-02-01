from django.contrib import admin

# Register your models here.
from .models import CustomUser, Product

admin.site.register(CustomUser)

admin.site.register(Product)
