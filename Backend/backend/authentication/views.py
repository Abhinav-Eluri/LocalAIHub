import openai

from django.utils import timezone
from django.utils.timezone import now
from rest_framework import mixins, status
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework.status import HTTP_201_CREATED
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser

from .models import Product, AIChat, Message, Slot, Participant
from .serializers import UserSerializer, ProductSerializer, AIChatSerializer, SlotSerializer
from rest_framework.response import Response
from rest_framework import viewsets


User = get_user_model()


class AuthViewSet(viewsets.GenericViewSet,mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin):
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

class ProductViewSet(viewsets.GenericViewSet,mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def images(self):
        return []

class AIChatViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin):
    queryset = AIChat.objects.all()
    serializer_class = AIChatSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data
        user_id = request.data.get("user_id")
        user = User.objects.filter(id=user_id).first()
        chat = AIChat(
            name=request.data.get("name"),
            model=request.data.get("model"),
        )
        chat.user = user
        chat.save()

        return Response(AIChatSerializer(chat).data, status=HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def request_response(self, request):
        chat_id = request.data.get("chat_id")
        content = request.data.get("message")
        chat = AIChat.objects.filter(id=chat_id).first()
        if not chat:
            raise Exception("Chat not available")
        message = Message(content=content, message_type="user")
        message.chat= chat
        message.save()

        # Now make a call to chatgpt API

class SlotViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin):
    queryset = Slot.objects.all()
    serializer_class = SlotSerializer
    permission_classes = []

    def create(self, request, *args, **kwargs):
        slot_data = request.data.get("slot_data")
        # Create a new Slot
        try:
            slot = Slot(duration=slot_data["duration"],
                        game_date=slot_data["game_date"],
                        max_participants=slot_data["max_participants"])
            slot.save()
            return Response({"message": "Slot created successfully"}, status.HTTP_201_CREATED)
        except KeyError as e:
            return Response({"error": f"Missing required field: {str(e)}"}, status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": str(e)}, status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Failed to create slot"}, status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["post"])
    def add_participant(self, request):
        participant_name = request.data.get("name")
        slot_id = request.data.get("slotId")

        try:
            slot = Slot.objects.get(id=slot_id)
            current_participants = slot.participants.count()

            if current_participants >= slot.max_participants:
                return Response(
                    {"error": "Slot is full"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            participant = Participant.objects.create(
                name=participant_name,
                slot=slot
            )

            return Response(
                {"message": "Added to the slot successfully"},
                status=status.HTTP_201_CREATED
            )

        except Slot.DoesNotExist:
            return Response(
                {"error": "Slot not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Failed to add participant"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )





