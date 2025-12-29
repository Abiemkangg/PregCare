"""
Notification API Views for PregCare
REST endpoints for notification management
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone

from .models import Notification, UserNotificationPreference
from .services import notification_service, notification_triggers


class NotificationListView(APIView):
    """
    GET: List user notifications
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get user's notification history"""
        user = request.user
        status_filter = request.query_params.get('status', None)
        limit = int(request.query_params.get('limit', 50))
        
        notifications = notification_service.get_user_notifications(
            user=user,
            status=status_filter,
            limit=limit
        )
        
        data = [{
            'id': n.id,
            'subject': n.subject,
            'body': n.plain_text_body or n.body[:200],
            'status': n.status,
            'priority': n.priority,
            'created_at': n.created_at.isoformat(),
            'sent_at': n.sent_at.isoformat() if n.sent_at else None,
            'read_at': n.read_at.isoformat() if n.read_at else None,
            'category': n.notification_type.category if n.notification_type else 'system'
        } for n in notifications]
        
        return Response({
            'success': True,
            'count': len(data),
            'unread_count': notification_service.get_unread_count(user),
            'notifications': data
        })


class NotificationDetailView(APIView):
    """
    GET: Get single notification
    POST: Mark notification as read
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, notification_id):
        """Get notification details"""
        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user
            )
            
            return Response({
                'success': True,
                'notification': {
                    'id': notification.id,
                    'subject': notification.subject,
                    'body': notification.body,
                    'plain_text_body': notification.plain_text_body,
                    'status': notification.status,
                    'priority': notification.priority,
                    'created_at': notification.created_at.isoformat(),
                    'sent_at': notification.sent_at.isoformat() if notification.sent_at else None,
                    'read_at': notification.read_at.isoformat() if notification.read_at else None,
                    'metadata': notification.metadata
                }
            })
        except Notification.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Notification not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request, notification_id):
        """Mark notification as read"""
        success = notification_service.mark_as_read(notification_id, request.user)
        
        if success:
            return Response({
                'success': True,
                'message': 'Notification marked as read'
            })
        else:
            return Response({
                'success': False,
                'message': 'Notification not found'
            }, status=status.HTTP_404_NOT_FOUND)


class NotificationPreferencesView(APIView):
    """
    GET: Get user notification preferences
    PUT: Update user notification preferences
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current notification preferences"""
        prefs = notification_service.get_user_preferences(request.user)
        
        return Response({
            'success': True,
            'preferences': {
                'email_enabled': prefs.email_enabled,
                'email_cycle_reminders': prefs.email_cycle_reminders,
                'email_fertile_alerts': prefs.email_fertile_alerts,
                'email_period_predictions': prefs.email_period_predictions,
                'email_ai_analysis': prefs.email_ai_analysis,
                'email_daily_checkin': prefs.email_daily_checkin,
                'email_partner_missions': prefs.email_partner_missions,
                'preferred_time': prefs.preferred_time.strftime('%H:%M'),
                'timezone': prefs.timezone,
                'digest_mode': prefs.digest_mode
            }
        })
    
    def put(self, request):
        """Update notification preferences"""
        prefs = notification_service.get_user_preferences(request.user)
        data = request.data
        
        # Update fields if provided
        updatable_fields = [
            'email_enabled',
            'email_cycle_reminders',
            'email_fertile_alerts',
            'email_period_predictions',
            'email_ai_analysis',
            'email_daily_checkin',
            'email_partner_missions',
            'digest_mode'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(prefs, field, bool(data[field]))
        
        if 'preferred_time' in data:
            try:
                from datetime import datetime
                time_obj = datetime.strptime(data['preferred_time'], '%H:%M').time()
                prefs.preferred_time = time_obj
            except ValueError:
                pass
        
        if 'timezone' in data:
            prefs.timezone = data['timezone']
        
        prefs.save()
        
        return Response({
            'success': True,
            'message': 'Preferences updated successfully'
        })


class UnreadCountView(APIView):
    """Get unread notification count"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        count = notification_service.get_unread_count(request.user)
        return Response({
            'success': True,
            'unread_count': count
        })


class MarkAllReadView(APIView):
    """Mark all notifications as read"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        updated = Notification.objects.filter(
            user=request.user,
            status__in=['sent', 'pending']
        ).update(
            status='read',
            read_at=timezone.now()
        )
        
        return Response({
            'success': True,
            'message': f'{updated} notifications marked as read'
        })


# =========================================
# Manual Trigger Endpoints (for testing)
# =========================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def trigger_cycle_reminder(request):
    """Manually trigger cycle reminder notification"""
    result = notification_triggers.on_cycle_data_reminder(request.user)
    
    if result:
        return Response({
            'success': True,
            'message': 'Cycle reminder notification sent',
            'notification_id': result.id
        })
    else:
        return Response({
            'success': False,
            'message': 'Notification blocked by user preferences'
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def trigger_test_email(request):
    """Send a test email to verify email configuration"""
    from .services import email_service
    
    user = request.user
    if not user.email:
        return Response({
            'success': False,
            'message': 'User has no email address configured'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    result = email_service.send_email(
        to_email=user.email,
        subject="Test Email dari PregCare",
        html_body="""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #FF69B4;">Test Email Berhasil!</h1>
            <p>Jika Anda menerima email ini, berarti konfigurasi email PregCare sudah benar.</p>
            <p>Terima kasih telah menggunakan PregCare!</p>
        </body>
        </html>
        """,
        plain_text_body="Test Email Berhasil! Konfigurasi email PregCare sudah benar."
    )
    
    return Response(result)
