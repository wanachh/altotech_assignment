# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router to automatically handle CRUD endpoints
router = DefaultRouter()
router.register(r'machines', views.MachineViewSet, basename='machine')
router.register(r'sensor-readings', views.SensorReadingViewSet, basename='sensor-reading')
router.register(r'ai-decisions', views.AIDecisionViewSet, basename='ai-decision')

urlpatterns = [
    # Include the auto-generated RESTful routes from the router
    path('', include(router.urls)),

    # Custom summary endpoints
    path('summary/', views.BuildingSummaryView.as_view(), name='building-summary'),
    path('energy-compare/', views.EnergyComparisonView.as_view(), name='energy-comparison'),
    path('ai-logs/', views.AILogsView.as_view(), name='ai-logs'),
]