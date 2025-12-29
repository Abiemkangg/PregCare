"""
Notification Models for PregCare
Stores notification history and templates
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class NotificationType(models.Model):
    """Types/templates for notifications"""
    
    CATEGORY_CHOICES = [
        ('cycle_reminder', 'Cycle Reminder'),
        ('fertile_window', 'Fertile Window Alert'),
        ('period_prediction', 'Period Prediction'),
        ('ai_analysis', 'AI Analysis Result'),
        ('daily_checkin', 'Daily Check-in Reminder'),
        ('partner_mission', 'Partner Mission'),
        ('system', 'System Notification'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    subject_template = models.CharField(max_length=255, help_text="Email subject template with {placeholders}")
    body_template = models.TextField(help_text="Email body template (HTML) with {placeholders}")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_types'
        verbose_name = 'Notification Type'
        verbose_name_plural = 'Notification Types'
    
    def __str__(self):
        return f"{self.name} ({self.category})"


class Notification(models.Model):
    """Notification history for users"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('read', 'Read'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.ForeignKey(
        NotificationType, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='notifications'
    )
    
    # Email content
    subject = models.CharField(max_length=255)
    body = models.TextField(help_text="Email body content (HTML)")
    plain_text_body = models.TextField(blank=True, help_text="Plain text version of email")
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    
    # Timestamps
    scheduled_at = models.DateTimeField(null=True, blank=True, help_text="When to send the notification")
    sent_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Error tracking
    error_message = models.TextField(blank=True)
    retry_count = models.IntegerField(default=0)
    max_retries = models.IntegerField(default=3)
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True, help_text="Additional data for the notification")
    
    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['status', 'scheduled_at']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"[{self.status}] {self.subject} - {self.user.username}"
    
    def mark_as_sent(self):
        """Mark notification as sent"""
        self.status = 'sent'
        self.sent_at = timezone.now()
        self.save(update_fields=['status', 'sent_at'])
    
    def mark_as_failed(self, error_message: str):
        """Mark notification as failed with error"""
        self.status = 'failed'
        self.error_message = error_message
        self.retry_count += 1
        self.save(update_fields=['status', 'error_message', 'retry_count'])
    
    def mark_as_read(self):
        """Mark notification as read"""
        self.status = 'read'
        self.read_at = timezone.now()
        self.save(update_fields=['status', 'read_at'])
    
    def can_retry(self) -> bool:
        """Check if notification can be retried"""
        return self.status == 'failed' and self.retry_count < self.max_retries


class UserNotificationPreference(models.Model):
    """User preferences for notifications"""
    
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='notification_preferences'
    )
    
    # Email preferences
    email_enabled = models.BooleanField(default=True)
    email_cycle_reminders = models.BooleanField(default=True)
    email_fertile_alerts = models.BooleanField(default=True)
    email_period_predictions = models.BooleanField(default=True)
    email_ai_analysis = models.BooleanField(default=True)
    email_daily_checkin = models.BooleanField(default=True)
    email_partner_missions = models.BooleanField(default=True)
    
    # Timing preferences
    preferred_time = models.TimeField(default='09:00', help_text="Preferred time to receive notifications")
    timezone = models.CharField(max_length=50, default='Asia/Jakarta')
    
    # Frequency
    digest_mode = models.BooleanField(default=False, help_text="Send notifications as daily digest")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_notification_preferences'
        verbose_name = 'User Notification Preference'
        verbose_name_plural = 'User Notification Preferences'
    
    def __str__(self):
        return f"Notification Preferences - {self.user.username}"
    
    def is_category_enabled(self, category: str) -> bool:
        """Check if a notification category is enabled for this user"""
        category_map = {
            'cycle_reminder': self.email_cycle_reminders,
            'fertile_window': self.email_fertile_alerts,
            'period_prediction': self.email_period_predictions,
            'ai_analysis': self.email_ai_analysis,
            'daily_checkin': self.email_daily_checkin,
            'partner_mission': self.email_partner_missions,
            'system': True,  # System notifications always enabled
        }
        return self.email_enabled and category_map.get(category, True)
