"""
Email and Notification Services for PregCare
Handles email sending via Gmail SMTP and notification management
"""
import os
import smtplib
import ssl
import logging
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth.models import User
from django.utils import timezone
from django.template import Template, Context
from django.db import transaction

logger = logging.getLogger(__name__)


class EmailService:
    """
    Gmail SMTP Email Service for PregCare
    
    Uses environment variables for secure configuration:
    - PREGCARE_EMAIL_HOST: SMTP host (default: smtp.gmail.com)
    - PREGCARE_EMAIL_PORT: SMTP port (default: 587)
    - PREGCARE_EMAIL_USER: Gmail address
    - PREGCARE_EMAIL_PASSWORD: Gmail App Password (not regular password!)
    - PREGCARE_EMAIL_FROM_NAME: Display name (default: PregCare)
    """
    
    def __init__(self):
        self.host = os.environ.get('PREGCARE_EMAIL_HOST', 'smtp.gmail.com')
        self.port = int(os.environ.get('PREGCARE_EMAIL_PORT', '587'))
        self.username = os.environ.get('PREGCARE_EMAIL_USER', '')
        self.password = os.environ.get('PREGCARE_EMAIL_PASSWORD', '')
        self.from_name = os.environ.get('PREGCARE_EMAIL_FROM_NAME', 'PregCare')
        self.use_tls = True
        
        # Validate configuration
        if not self.username or not self.password:
            logger.warning(
                "[WARN] Email credentials not configured. "
                "Set PREGCARE_EMAIL_USER and PREGCARE_EMAIL_PASSWORD environment variables."
            )
    
    def is_configured(self) -> bool:
        """Check if email service is properly configured"""
        return bool(self.username and self.password)
    
    def _create_message(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        plain_text_body: Optional[str] = None
    ) -> MIMEMultipart:
        """Create MIME message with HTML and plain text parts"""
        message = MIMEMultipart('alternative')
        message['Subject'] = subject
        message['From'] = formataddr((self.from_name, self.username))
        message['To'] = to_email
        
        # Plain text part
        if plain_text_body:
            text_part = MIMEText(plain_text_body, 'plain', 'utf-8')
            message.attach(text_part)
        
        # HTML part
        html_part = MIMEText(html_body, 'html', 'utf-8')
        message.attach(html_part)
        
        return message
    
    def send_email(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        plain_text_body: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send email synchronously
        
        Returns:
            dict with 'success', 'message', and optionally 'error'
        """
        if not self.is_configured():
            return {
                'success': False,
                'message': 'Email service not configured',
                'error': 'Missing PREGCARE_EMAIL_USER or PREGCARE_EMAIL_PASSWORD'
            }
        
        try:
            message = self._create_message(to_email, subject, html_body, plain_text_body)
            
            # Create secure SSL/TLS context
            context = ssl.create_default_context()
            
            with smtplib.SMTP(self.host, self.port) as server:
                server.ehlo()
                server.starttls(context=context)
                server.ehlo()
                server.login(self.username, self.password)
                server.sendmail(self.username, to_email, message.as_string())
            
            logger.info(f"[OK] Email sent successfully to {to_email}")
            return {
                'success': True,
                'message': f'Email sent to {to_email}'
            }
            
        except smtplib.SMTPAuthenticationError as e:
            error_msg = "SMTP authentication failed. Check Gmail App Password."
            logger.error(f"[ERROR] {error_msg}: {e}")
            return {
                'success': False,
                'message': 'Authentication failed',
                'error': error_msg
            }
        except smtplib.SMTPException as e:
            error_msg = f"SMTP error: {str(e)}"
            logger.error(f"[ERROR] {error_msg}")
            return {
                'success': False,
                'message': 'SMTP error occurred',
                'error': error_msg
            }
        except Exception as e:
            error_msg = f"Unexpected error: {str(e)}"
            logger.error(f"[ERROR] {error_msg}")
            return {
                'success': False,
                'message': 'Failed to send email',
                'error': error_msg
            }
    
    def send_email_async(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        plain_text_body: Optional[str] = None,
        callback: Optional[callable] = None
    ) -> None:
        """
        Send email asynchronously using threading
        
        Args:
            callback: Optional function to call with result dict
        """
        def _send():
            result = self.send_email(to_email, subject, html_body, plain_text_body)
            if callback:
                callback(result)
        
        thread = threading.Thread(target=_send, daemon=True)
        thread.start()
        logger.info(f"[INFO] Async email queued for {to_email}")


class NotificationService:
    """
    Notification management service for PregCare
    
    Handles creating, sending, and managing notifications
    with database persistence for history tracking.
    """
    
    def __init__(self):
        self.email_service = EmailService()
    
    def get_user_email(self, user: User) -> Optional[str]:
        """Get user's email address"""
        return user.email if user.email else None
    
    def get_user_preferences(self, user: User):
        """Get or create user notification preferences"""
        from .models import UserNotificationPreference
        
        prefs, _ = UserNotificationPreference.objects.get_or_create(user=user)
        return prefs
    
    def can_send_notification(self, user: User, category: str) -> bool:
        """Check if user should receive notification of this category"""
        prefs = self.get_user_preferences(user)
        return prefs.is_category_enabled(category)
    
    def create_notification(
        self,
        user: User,
        subject: str,
        body: str,
        category: str = 'system',
        priority: str = 'normal',
        plain_text_body: Optional[str] = None,
        metadata: Optional[Dict] = None,
        scheduled_at: Optional[datetime] = None,
        send_immediately: bool = True
    ):
        """
        Create and optionally send a notification
        
        Args:
            user: Target user
            subject: Email subject
            body: HTML body content
            category: Notification category (for preference checking)
            priority: low/normal/high/urgent
            plain_text_body: Plain text version
            metadata: Additional data to store
            scheduled_at: When to send (None for immediate)
            send_immediately: Send now if scheduled_at is None
        
        Returns:
            Notification instance
        """
        from .models import Notification, NotificationType
        
        # Check user preferences
        if not self.can_send_notification(user, category):
            logger.info(f"[INFO] Notification blocked by user preferences: {user.username} - {category}")
            return None
        
        # Get notification type if exists
        notification_type = NotificationType.objects.filter(
            category=category, 
            is_active=True
        ).first()
        
        # Create notification record
        notification = Notification.objects.create(
            user=user,
            notification_type=notification_type,
            subject=subject,
            body=body,
            plain_text_body=plain_text_body or '',
            priority=priority,
            scheduled_at=scheduled_at,
            metadata=metadata or {}
        )
        
        logger.info(f"[OK] Notification created: {notification.id} for {user.username}")
        
        # Send immediately if requested and not scheduled
        if send_immediately and not scheduled_at:
            self.send_notification(notification)
        
        return notification
    
    def send_notification(self, notification) -> bool:
        """
        Send a notification via email
        
        Returns:
            True if successful, False otherwise
        """
        user_email = self.get_user_email(notification.user)
        
        if not user_email:
            notification.mark_as_failed("User has no email address")
            return False
        
        def on_email_sent(result: Dict):
            """Callback for async email sending"""
            if result['success']:
                notification.mark_as_sent()
            else:
                notification.mark_as_failed(result.get('error', 'Unknown error'))
        
        # Send email asynchronously
        self.email_service.send_email_async(
            to_email=user_email,
            subject=notification.subject,
            html_body=notification.body,
            plain_text_body=notification.plain_text_body,
            callback=on_email_sent
        )
        
        return True
    
    def get_user_notifications(
        self,
        user: User,
        status: Optional[str] = None,
        limit: int = 50
    ) -> List:
        """Get notifications for a user"""
        from .models import Notification
        
        queryset = Notification.objects.filter(user=user)
        
        if status:
            queryset = queryset.filter(status=status)
        
        return list(queryset[:limit])
    
    def mark_as_read(self, notification_id: int, user: User) -> bool:
        """Mark a notification as read"""
        from .models import Notification
        
        try:
            notification = Notification.objects.get(id=notification_id, user=user)
            notification.mark_as_read()
            return True
        except Notification.DoesNotExist:
            return False
    
    def get_unread_count(self, user: User) -> int:
        """Get count of unread notifications for user"""
        from .models import Notification
        
        return Notification.objects.filter(
            user=user,
            status__in=['sent', 'pending']
        ).count()


# =========================================
# Event-Based Notification Triggers
# =========================================

class NotificationTriggers:
    """
    Event-based notification triggers for PregCare
    
    Call these methods when specific events occur in the system
    to automatically send appropriate notifications to users.
    """
    
    def __init__(self):
        self.service = NotificationService()
    
    def on_cycle_data_reminder(self, user: User) -> Optional[Any]:
        """
        Trigger: Daily reminder to input cycle data
        
        Called by: Scheduled task (daily at user's preferred time)
        """
        subject = "Pengingat Input Data Siklus - PregCare"
        
        body = self._get_email_template(
            title="Jangan Lupa Catat Siklus Hari Ini",
            content="""
            <p>Halo {name},</p>
            <p>Ini pengingat harian untuk mencatat kondisi siklus Anda hari ini.</p>
            <p>Pencatatan rutin membantu kami memberikan prediksi dan analisis yang lebih akurat untuk perjalanan kehamilan Anda.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{app_url}/daily-checkin" style="background: linear-gradient(135deg, #FF69B4, #9B59B6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                    Catat Sekarang
                </a>
            </div>
            <p>Tetap semangat dan jaga kesehatan!</p>
            """.format(
                name=user.first_name or user.username,
                app_url=os.environ.get('PREGCARE_APP_URL', 'http://localhost:5173')
            ),
            footer="Pengingat ini dikirim sesuai preferensi notifikasi Anda."
        )
        
        plain_text = f"""
Halo {user.first_name or user.username},

Ini pengingat harian untuk mencatat kondisi siklus Anda hari ini.
Pencatatan rutin membantu kami memberikan prediksi dan analisis yang lebih akurat.

Kunjungi aplikasi PregCare untuk mencatat sekarang.

Tetap semangat dan jaga kesehatan!

- Tim PregCare
        """
        
        return self.service.create_notification(
            user=user,
            subject=subject,
            body=body,
            category='cycle_reminder',
            priority='normal',
            plain_text_body=plain_text,
            metadata={'trigger': 'daily_cycle_reminder'}
        )
    
    def on_fertile_window_approaching(self, user: User, fertile_start: datetime, ovulation_date: datetime) -> Optional[Any]:
        """
        Trigger: Fertile window is approaching
        
        Called by: Daily analysis task when user is entering fertile window
        """
        days_until = (fertile_start.date() - timezone.now().date()).days
        
        subject = f"Masa Subur Dimulai dalam {days_until} Hari - PregCare"
        
        body = self._get_email_template(
            title="Masa Subur Anda Segera Tiba!",
            content=f"""
            <p>Halo {user.first_name or user.username},</p>
            <p>Berdasarkan analisis siklus Anda, kami memprediksi:</p>
            <div style="background: #FFF5F8; padding: 20px; border-radius: 15px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Masa Subur Dimulai:</strong> {fertile_start.strftime('%d %B %Y')}</p>
                <p style="margin: 5px 0;"><strong>Prediksi Ovulasi:</strong> {ovulation_date.strftime('%d %B %Y')}</p>
            </div>
            <p>Ini adalah waktu optimal untuk program kehamilan Anda.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{os.environ.get('PREGCARE_APP_URL', 'http://localhost:5173')}/fertility-tracker" style="background: linear-gradient(135deg, #FF69B4, #9B59B6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                    Lihat Detail Siklus
                </a>
            </div>
            """
        )
        
        return self.service.create_notification(
            user=user,
            subject=subject,
            body=body,
            category='fertile_window',
            priority='high',
            metadata={
                'trigger': 'fertile_window_approaching',
                'fertile_start': str(fertile_start.date()),
                'ovulation_date': str(ovulation_date.date())
            }
        )
    
    def on_period_prediction(self, user: User, predicted_date: datetime) -> Optional[Any]:
        """
        Trigger: Period is predicted to start soon
        
        Called by: Daily analysis task, typically 2-3 days before predicted period
        """
        days_until = (predicted_date.date() - timezone.now().date()).days
        
        subject = f"Prediksi Menstruasi dalam {days_until} Hari - PregCare"
        
        body = self._get_email_template(
            title="Persiapkan Diri untuk Siklus Berikutnya",
            content=f"""
            <p>Halo {user.first_name or user.username},</p>
            <p>Berdasarkan pola siklus Anda, menstruasi diprediksi akan dimulai pada:</p>
            <div style="background: #FFF5F8; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
                <p style="font-size: 24px; font-weight: bold; color: #FF69B4; margin: 0;">
                    {predicted_date.strftime('%d %B %Y')}
                </p>
                <p style="color: #888; margin-top: 10px;">({days_until} hari lagi)</p>
            </div>
            <p>Pastikan Anda sudah mempersiapkan keperluan dan menjaga kesehatan.</p>
            """
        )
        
        return self.service.create_notification(
            user=user,
            subject=subject,
            body=body,
            category='period_prediction',
            priority='normal',
            metadata={
                'trigger': 'period_prediction',
                'predicted_date': str(predicted_date.date()),
                'days_until': days_until
            }
        )
    
    def on_ai_analysis_complete(self, user: User, analysis_result: Dict) -> Optional[Any]:
        """
        Trigger: AI has completed cycle analysis
        
        Called by: After CycleAnalysis.generate_analysis() completes
        """
        analysis_type = analysis_result.get('type', 'normal')
        message = analysis_result.get('message', '')
        recommendations = analysis_result.get('recommendations', [])
        
        # Format recommendations as HTML list
        recommendations_html = ''.join([f'<li>{rec}</li>' for rec in recommendations[:4]])
        
        # Determine alert level based on analysis type
        alert_colors = {
            'normal': '#4CAF50',
            'irregular': '#FF9800',
            'short': '#FF5722',
            'long': '#FF5722',
            'insufficient_data': '#9E9E9E'
        }
        alert_color = alert_colors.get(analysis_type, '#9E9E9E')
        
        subject = f"Hasil Analisis Siklus Anda - PregCare"
        
        body = self._get_email_template(
            title="Hasil Analisis AI untuk Siklus Anda",
            content=f"""
            <p>Halo {user.first_name or user.username},</p>
            <p>AI kami telah menyelesaikan analisis siklus menstruasi Anda.</p>
            
            <div style="background: {alert_color}20; border-left: 4px solid {alert_color}; padding: 15px 20px; border-radius: 0 10px 10px 0; margin: 20px 0;">
                <p style="font-weight: bold; color: {alert_color}; margin: 0 0 10px 0;">
                    Status: {analysis_type.replace('_', ' ').title()}
                </p>
                <p style="margin: 0; color: #333;">{message}</p>
            </div>
            
            <h3 style="color: #333; margin-top: 25px;">Rekomendasi:</h3>
            <ul style="color: #555;">
                {recommendations_html}
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{os.environ.get('PREGCARE_APP_URL', 'http://localhost:5173')}/dashboard" style="background: linear-gradient(135deg, #FF69B4, #9B59B6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                    Lihat Detail Lengkap
                </a>
            </div>
            """
        )
        
        return self.service.create_notification(
            user=user,
            subject=subject,
            body=body,
            category='ai_analysis',
            priority='high' if analysis_type in ['irregular', 'short', 'long'] else 'normal',
            metadata={
                'trigger': 'ai_analysis_complete',
                'analysis_type': analysis_type,
                'analysis_id': analysis_result.get('id')
            }
        )
    
    def on_partner_mission_reminder(self, user: User, mission_title: str) -> Optional[Any]:
        """
        Trigger: Daily reminder for partner mission
        
        Called by: Scheduled task for partner missions
        """
        subject = f"Misi Pasangan Hari Ini - PregCare"
        
        body = self._get_email_template(
            title="Misi Pasangan Menunggu!",
            content=f"""
            <p>Halo {user.first_name or user.username},</p>
            <p>Ada misi pasangan yang menunggu untuk dikerjakan bersama:</p>
            
            <div style="background: linear-gradient(135deg, #FFE5EC, #E8D5F2); padding: 25px; border-radius: 15px; margin: 20px 0; text-align: center;">
                <p style="font-size: 20px; font-weight: bold; color: #9B59B6; margin: 0;">
                    {mission_title}
                </p>
            </div>
            
            <p>Misi pasangan membantu mempererat hubungan dan mendukung perjalanan program kehamilan Anda berdua.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{os.environ.get('PREGCARE_APP_URL', 'http://localhost:5173')}/misi-pasangan" style="background: linear-gradient(135deg, #FF69B4, #9B59B6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                    Kerjakan Misi
                </a>
            </div>
            """
        )
        
        return self.service.create_notification(
            user=user,
            subject=subject,
            body=body,
            category='partner_mission',
            priority='normal',
            metadata={
                'trigger': 'partner_mission_reminder',
                'mission_title': mission_title
            }
        )
    
    def _get_email_template(self, title: str, content: str, footer: str = "") -> str:
        """Generate consistent email HTML template"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #FF69B4, #9B59B6); padding: 30px; border-radius: 20px 20px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">PregCare</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Pendamping Perjalanan Kehamilan Anda</p>
                </div>
                
                <!-- Content -->
                <div style="background: white; padding: 40px 30px; border-radius: 0 0 20px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; margin-top: 0; font-size: 22px;">{title}</h2>
                    {content}
                </div>
                
                <!-- Footer -->
                <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
                    <p>{footer if footer else "Email ini dikirim otomatis oleh sistem PregCare."}</p>
                    <p>Untuk berhenti menerima email ini, atur preferensi notifikasi Anda di aplikasi.</p>
                    <p style="margin-top: 15px;">&copy; 2025 PregCare. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """


# Singleton instances for easy access
email_service = EmailService()
notification_service = NotificationService()
notification_triggers = NotificationTriggers()
