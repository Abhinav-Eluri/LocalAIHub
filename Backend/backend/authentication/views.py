from django.utils import timezone
from django.utils.timezone import now
from rest_framework import mixins, status
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import viewsets


User = get_user_model()


class AuthViewSet(viewsets.GenericViewSet,mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin,):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({"message": "Invalid credentials"}, status=400)

        # Generate JWT tokens
        refresh_token = RefreshToken.for_user(user)
        access_token = str(refresh_token.access_token)

        # Update last login
        user.last_login = now()
        user.save()

        return Response({
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": str(refresh_token),
            "user": UserSerializer(user).data
        })

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Blacklist the refresh token to log the user out"""
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def register(self, request):
        print("I am in register")
        User.objects.create_user(username=request.data.get('username'),
                                 email=request.data.get("password") ,
                                 password=request.data.get('password'),
                                 first_name=request.data.get('first_name'),
                                 last_name=request.data.get('last_name')

                                 )

        return Response({"message": "Register"})

    @action(detail=False, methods=['post'])
    def reset_password(self, request):
        email = request.data.get('email')
        user = User.objects.filter(username=email).first()

        if user is None:
            return Response({"message": f"No account found with email {email}"},
                            status=400)  # Use f-string for string interpolation

        # Logic for sending reset password email goes here...
        return Response({"message": "Email sent"})