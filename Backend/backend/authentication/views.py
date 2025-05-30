import json
import os


import openai
from django.http import StreamingHttpResponse
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

from rest_framework.renderers import BaseRenderer
from django.utils.timezone import now
from rest_framework import status, serializers
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework.status import HTTP_201_CREATED
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser

from langchain_community.tools import DuckDuckGoSearchRun, DuckDuckGoSearchResults

from .models import AIChat, Message, Slot, Participant, Workflow, Agent, Task, Execution
from .serializers import UserSerializer, AIChatSerializer, SlotSerializer, WorkflowSerializer, AgentSerializer, \
    TaskSerializer
from rest_framework.response import Response

from .services.factory import AIProviderFactory

load_dotenv()
openai.api_key = os.environ.get("OPENAI_API_KEY")

User = get_user_model()


class EventStreamRenderer(BaseRenderer):
    media_type = 'text/event-stream'
    format = 'text-event-stream'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        return data


class AuthViewSet(ModelViewSet):
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
                                 email=request.data.get("password"),
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


class AIChatViewSet(ModelViewSet):
    queryset = AIChat.objects.all()
    serializer_class = AIChatSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.OPENAI_MODELS = [
            "gpt-3.5-turbo", "gpt-4o", "gpt-4o-mini", "gpt-4", "gpt-4-turbo",
            "gpt-3.5-turbo-16k", "gpt-4-32k",

        ]

        self.CLAUDE_MODELS = [
            "claude-3-5-sonnet-latest", "claude-3-5-haiku-latest", "claude-3-haiku-20240307"
        ]

        self.GEMINI_MODELS = [
            "gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite-preview-02-05",
            "gemini-1.5-flash-8b", "gemini-1.5-pro"
        ]
        self.OLLAMA_MODELS = [
            "llama3.2", "deepseek-r1", "llama3.3"
        ]
        self.COHERE_MODELS = ["command-r-plus-08-2024", "command-light", "command-light-nightly", "command-nightly", "command-r"]

    def get_provider_for_model(self, model_name: str):
        """Get the appropriate provider and API key for a model"""
        if model_name in self.OPENAI_MODELS:
            return AIProviderFactory.create_provider(
                "openai",
                os.environ.get("OPENAI_API_KEY")
            )

        if model_name in self.CLAUDE_MODELS:
            return AIProviderFactory.create_provider(
                "claude",
                os.environ.get("ANTHROPIC_API_KEY")
            )

        if model_name in self.GEMINI_MODELS:
            return AIProviderFactory.create_provider(
                "gemini",
                os.environ.get("GEMINI_API_KEY")
            )
        if model_name in self.OLLAMA_MODELS:
            return AIProviderFactory.create_provider(
                "offline",
                ""
            )

        if model_name in self.COHERE_MODELS:
            return AIProviderFactory.create_provider(
                "cohere",
                os.environ.get('COHERE_API_KEY')

            )

        raise ValueError(f"Unsupported model: {model_name}")

    def create(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        user = User.objects.filter(id=user_id).first()
        chat = AIChat(
            name=request.data.get("name"),
            model=request.data.get("model"),
        )
        chat.user = user
        chat.save()

        return Response(AIChatSerializer(chat).data, status=HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path="stream",
            renderer_classes=[EventStreamRenderer],
            authentication_classes=[], permission_classes=[])
    def stream(self, request, pk=None):
        """
        Streams AI-generated responses via Server-Sent Events (SSE).
        Authentication is done via a token in the query parameters.
        """
        try:
            # Token validation
            token = request.GET.get("token")
            if not token:
                return Response(
                    {"error": "Token missing"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            try:
                decoded_token = AccessToken(token)
                user = User.objects.get(id=decoded_token["user_id"])
            except Exception as e:
                return Response(
                    {"error": "Invalid token"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Parameter validation
            chat_id = pk
            content = request.GET.get("message")

            if not chat_id or not content:
                return Response(
                    {"error": "Missing chat_id or message"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Chat validation
            chat = AIChat.objects.filter(id=chat_id, user=user).first()
            if not chat:
                return Response(
                    {"error": "Chat not found or access denied"},
                    status=status.HTTP_404_NOT_FOUND
                )

            try:
                # Get provider instance directly
                provider = self.get_provider_for_model(chat.model)
            except ValueError as e:
                return Response(
                    {"error": str(e)},  # This will contain "Unsupported model: model_name"
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get previous messages
            previous_messages = Message.objects.filter(chat=chat).order_by('created_at')

            # Format messages for OpenAI
            messages_for_ai = []

            # Add previous messages
            for msg in previous_messages:
                role = "assistant" if msg.sender == "assistant" else "user"
                messages_for_ai.append({
                    "role": role,
                    "content": msg.content
                })

            # Add current message
            messages_for_ai.append({
                "role": "user",
                "content": content
            })

            # Save the user message
            Message.objects.create(
                chat=chat,
                content=content,
                sender='user'
            )

            # SSE streaming implementation
            def event_stream():
                try:
                    complete_response = ""
                    for chunk in provider.generate_stream(messages_for_ai, chat.model):
                        complete_response += chunk
                        yield f"data: {json.dumps({'content': chunk})}\n\n"

                    # Save the assistant message
                    Message.objects.create(
                        chat=chat,
                        content=complete_response,
                        sender='assistant'
                    )
                    yield f"data: {json.dumps({'content': '[DONE]'})}\n\n"

                except Exception as e:
                    error_message = str(e)
                    Message.objects.create(
                        chat=chat,
                        content=f"Error: {error_message}",
                        sender='assistant'
                    )
                    yield f"data: {json.dumps({'error': error_message})}\n\n"

            response = StreamingHttpResponse(
                event_stream(),
                content_type='text/event-stream'
            )
            response['Cache-Control'] = 'no-cache'
            response['X-Accel-Buffering'] = 'no'
            return response

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], authentication_classes=[], permission_classes=[])
    def search(self, request):
        message = request.data.get("message")
        web_search = request.data.get("searchActive")
        api_key = os.environ.get("OPENAI_API_KEY")
        # Initialize the OpenAI model with your API key
        model = ChatOpenAI(model="gpt-3.5-turbo-0125", api_key=api_key)

        # Web search
        if web_search:
            memory = MemorySaver()
            search = DuckDuckGoSearchResults()

            # Define tools for the agent
            tools = [search]

            agent_executor = create_react_agent(model, tools, checkpointer=memory)

            config = {"configurable": {"thread_id": "abc123"}}
            response = agent_executor.invoke({"messages": [HumanMessage(content=message)]}, config)

            # Extract the final response message
            final_message = response["messages"][-1].content
        else:
            response = model.invoke([HumanMessage(content=message)])
            final_message = response.content

        return Response({"message":final_message})


# Badminton

class SlotViewSet(ModelViewSet):
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


class WorkflowViewSet(ModelViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        workflow = Workflow(
            name=request.data.get("name"),
            description=request.data.get("description"),
            user=user
        )
        workflow.save()

        return Response(WorkflowSerializer(workflow).data, status=HTTP_201_CREATED)

    def _update_or_create_agent(self, agent_id, agent_data, workflow):
        agent_id = agent_id  # Assuming agent ID is in the 'id' field
        agent_defaults = {
            'name': agent_data.get('label'),
            'role': agent_data.get('role'),
            'goal': agent_data.get('goal'),
            'backstory': agent_data.get('backstory'),
            'config': {},  # Handle config data as needed
        }

        agent, created = Agent.objects.update_or_create(
            agent_id=agent_id,  # Look up by the ID
            workflow=workflow,  # Limit to current workflow
            defaults=agent_defaults
        )

        return agent

    @action(detail=True, methods=['put'])
    def save(self, request, pk=None):
        try:
            workflow = self.get_object()
            data = request.data

            workflow.tasks.all().delete()  # Clear all tasks
            workflow.agents.all().delete()  # Clear all agents

            nodes_data = data.get('nodes', [])  # data prop has changed, so we need to reflect it here
            edge_data_all = data.get('edges', [])  # now getting the edges for you
            agent_data_all = [node for node in nodes_data if node.get('type') == 'agent']
            task_data_all = [node for node in nodes_data if node.get('type') == 'task']

            # We are only performing operations on the current workflow, it does not matter whether this data has been cleared or not.
            agent_ids = []
            task_ids = []
            # For each agent
            for agent_data in agent_data_all:
                try:
                    agent = self._update_or_create_agent(agent_data["id"], agent_data["data"],
                                                         workflow)  # now accessing the correct agent data.
                    agent_ids.append(agent.id)
                except:
                    continue  # We will only proceed to perform those action where it succeeds.

            # For each task, We are only interested in the tasks that have a type or have associated agents.
            for task_data in task_data_all:
                try:
                    task_data_data = task_data.get("data")  # access the correct task data prop
                    # Get the agent id by looking through the edges
                    assignee = None
                    for edge in edge_data_all:
                        if edge["source"] == task_data["id"]:  # If the source is the node you want
                            assignee = edge["target"]  # That is the agent that will perform the task

                    # See if assignee exists
                    agent_assigned = Agent.objects.filter(agent_id=assignee).first()  # Find the assignned object

                    task_object = Task.objects.create(name=task_data_data.get('name'),
                                                      description=task_data_data.get('description'),
                                                      workflow=workflow, agent=agent_assigned, config={})
                    task_object.save()
                    task_ids.append(task_object.id)  # Save all data

                except:
                    continue

            return Response({"message": "Workflow saved successfully"}, status=status.HTTP_200_OK)

        except Workflow.DoesNotExist:
            return Response({"error": "Workflow not found"}, status=status.HTTP_404_NOT_FOUND)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({"error": "An error occurred during save."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Run the workflow

