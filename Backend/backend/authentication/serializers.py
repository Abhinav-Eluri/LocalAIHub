from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model

from .models import AIChat, Slot, Message, Workflow, Agent, Task

# Uses the Django User model if nothing is set in particular in settings.py
# Add this AUTH_USER_MODEL = 'authentication.CustomUser' in settings.py to use the CustomUser model
User = get_user_model()


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'subscription']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields='__all__'


class AIChatSerializer(ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    class Meta:
        model = AIChat
        fields = '__all__'

class SlotSerializer(ModelSerializer):
    class Meta:
        model = Slot
        fields = '__all__'

class AgentSerializer(ModelSerializer):
    class Meta:
        model = Agent
        fields = '__all__'

class TaskSerializer(ModelSerializer):
    agent = AgentSerializer(many=False, read_only=True)
    class Meta:
        model = Task
        fields = '__all__'



class WorkflowSerializer(ModelSerializer):
    tasks = TaskSerializer(many=True)
    agents = AgentSerializer(many=True, read_only=True)
    class Meta:
        model = Workflow
        fields = '__all__'

