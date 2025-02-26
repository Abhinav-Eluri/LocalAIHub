from datetime import timedelta

from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils import timezone


class CustomUser(AbstractUser):
    SUBSCRIPTION_CHOICES = [
        ("free", "FREE"),
        ("premium", "PREMIUM"),]

    subscription = models.CharField(max_length=20, choices=SUBSCRIPTION_CHOICES, default="free")
    groups = models.ManyToManyField(Group, related_name="customuser_set", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="customuser_permissions", blank=True)


    def __str__(self):
        return self.username

# Chat

class AIChat(models.Model):
    name = models.CharField(max_length=256)
    model = models.CharField(max_length=100)
    user = models.ForeignKey(CustomUser, null=True, blank=True, related_name="chats", on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

class Message(models.Model):
    SENDER_TYPES = (
        ('user', 'User Message'),
        ('assistant', 'Assistant Message'),
    )

    chat = models.ForeignKey(
        AIChat,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    content = models.TextField()
    sender = models.CharField(
        max_length=20,
        choices=SENDER_TYPES,
        default='user'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.message_type} - {self.chat.name}"

# Badminton
class Slot(models.Model):
    game_date = models.DateTimeField(verbose_name="Date")
    duration = models.IntegerField()
    max_participants = models.IntegerField()

    def __str__(self):
        start_time = self.game_date
        end_time = start_time + timedelta(hours=float(self.duration))
        return f"{start_time.strftime('%Y-%m-%d %H:%M')} - {end_time.strftime('%H:%M')} ({self.max_participants} max)"

class Participant(models.Model):
    name = models.CharField(max_length=150)
    slot = models.ForeignKey(Slot, on_delete=models.CASCADE, related_name='participants')
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

# Workflow

class Workflow(models.Model):
    name = models.CharField(max_length=256)
    description = models.TextField(null=True, blank=True)
    user = models.ForeignKey(CustomUser, null=True, blank=True, related_name="workflows", on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

class Agent(models.Model):
    name = models.CharField(max_length=256, default=None)
    role = models.CharField(max_length=1000, default=None)
    goal = models.TextField(default="")
    backstory = models.TextField(default="")
    workflow = models.ForeignKey(Workflow, null=True, blank=True, related_name="agents", on_delete=models.CASCADE)
    config = models.JSONField(null=True, blank=True)
    agent_id = models.CharField(max_length=256, default=None)
    next_agent = models.ForeignKey('self', null=True, blank=True, related_name="previous_agent", on_delete=models.CASCADE)

class Task(models.Model):
    name = models.CharField(max_length=256)
    description = models.TextField()
    workflow = models.ForeignKey(Workflow, null=True, blank=True, related_name="tasks", on_delete=models.CASCADE)
    agent = models.ForeignKey(Agent, null=True, blank=True, related_name="tasks", on_delete=models.CASCADE)
    config = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.name


class Execution(models.Model):
    workflow = models.ForeignKey(Workflow, null=True, blank=True, related_name="executions", on_delete=models.CASCADE)
    status = models.CharField(max_length=256)
    result = models.JSONField()
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)





