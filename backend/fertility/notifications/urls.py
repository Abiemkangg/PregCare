"""
URL routes for Notification API
"""
from django.urls import path
from . import views

urlpatterns = [
    # Notification list and management
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('<int:notification_id>/', views.NotificationDetailView.as_view(), name='notification-detail'),
    
    # Preferences
    path('preferences/', views.NotificationPreferencesView.as_view(), name='notification-preferences'),
    
    # Actions
    path('unread-count/', views.UnreadCountView.as_view(), name='notification-unread-count'),
    path('mark-all-read/', views.MarkAllReadView.as_view(), name='notification-mark-all-read'),
    
    # Manual triggers (for testing)
    path('trigger/cycle-reminder/', views.trigger_cycle_reminder, name='trigger-cycle-reminder'),
    path('trigger/test-email/', views.trigger_test_email, name='trigger-test-email'),
]
