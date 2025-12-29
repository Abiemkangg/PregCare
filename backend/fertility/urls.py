from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FertilityProfileViewSet,
    MenstrualCycleViewSet,
    SymptomViewSet,
    CycleAnalysisViewSet
)

router = DefaultRouter()
router.register(r'profiles', FertilityProfileViewSet, basename='fertility-profile')
router.register(r'cycles', MenstrualCycleViewSet, basename='menstrual-cycle')
router.register(r'symptoms', SymptomViewSet, basename='symptom')
router.register(r'analyses', CycleAnalysisViewSet, basename='cycle-analysis')

urlpatterns = [
    path('', include(router.urls)),
    # Notification API routes
    path('notifications/', include('fertility.notifications.urls')),
]
