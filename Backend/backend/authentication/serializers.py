from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model


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
