from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import AuthViewSet, AIChatViewSet, SlotViewSet, WorkflowViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'chat', AIChatViewSet, basename='aichat')
router.register(r'slot', SlotViewSet,basename='slot')
router.register(r'workflow', WorkflowViewSet,basename='workflow')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


]
