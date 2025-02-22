from django.contrib import admin

# Register your models here.
from .models import CustomUser, AIChat, Slot, Participant

admin.site.register(CustomUser)

admin.site.register(AIChat)

admin.site.register(Slot)

admin.site.register(Participant)