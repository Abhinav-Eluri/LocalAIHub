from django.contrib import admin

# Register your models here.
from .models import CustomUser, Product, Image, AIChat, Slot, Participant

admin.site.register(CustomUser)

admin.site.register(Product)

admin.site.register(Image)

admin.site.register(AIChat)

admin.site.register(Slot)

admin.site.register(Participant)