"""
Test Email Notification Command
Sends a test email to verify Gmail SMTP configuration
"""
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from django.utils import timezone
from fertility.notifications.services import notification_triggers, email_service
from datetime import timedelta
import os


class Command(BaseCommand):
    help = 'Test email notification by sending a test email'

    def add_arguments(self, parser):
        parser.add_argument(
            '--user-id',
            type=int,
            help='User ID to send test email to',
        )
        parser.add_argument(
            '--email',
            type=str,
            help='Email address to send test to (will use or create user)',
        )
        parser.add_argument(
            '--type',
            type=str,
            default='cycle_reminder',
            choices=['cycle_reminder', 'fertile_window', 'period', 'ai_analysis', 'partner_mission', 'simple'],
            help='Type of notification to send',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.HTTP_INFO('\n=== Email Configuration Test ===\n'))
        
        # Check environment variables
        email_user = os.environ.get('PREGCARE_EMAIL_USER', '')
        email_password = os.environ.get('PREGCARE_EMAIL_PASSWORD', '')
        
        self.stdout.write(f"📧 Email User: {email_user or '❌ NOT SET'}")
        self.stdout.write(f"🔐 Email Password: {'✅ SET' if email_password else '❌ NOT SET'}")
        self.stdout.write(f"📮 SMTP Host: {os.environ.get('PREGCARE_EMAIL_HOST', 'smtp.gmail.com')}")
        self.stdout.write(f"🔌 SMTP Port: {os.environ.get('PREGCARE_EMAIL_PORT', '587')}\n")
        
        if not email_user or not email_password:
            self.stdout.write(self.style.ERROR(
                '❌ Email credentials not configured!\n'
                'Please set PREGCARE_EMAIL_USER and PREGCARE_EMAIL_PASSWORD in your .env file\n'
                'See SETUP_EMAIL.md for instructions.'
            ))
            return
        
        # Get or create user
        user = None
        if options['user_id']:
            try:
                user = User.objects.get(id=options['user_id'])
            except User.DoesNotExist:
                raise CommandError(f'User with ID {options["user_id"]} does not exist')
        elif options['email']:
            user, created = User.objects.get_or_create(
                email=options['email'],
                defaults={
                    'username': options['email'].split('@')[0],
                    'first_name': 'Test',
                    'last_name': 'User'
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✅ Created test user: {user.email}'))
        else:
            # Get first user
            user = User.objects.first()
            if not user:
                raise CommandError('No users found in database. Please create a user first.')
        
        self.stdout.write(self.style.HTTP_INFO(f'\n📨 Sending test email to: {user.email}'))
        self.stdout.write(f'   User: {user.get_full_name() or user.username}')
        self.stdout.write(f'   Type: {options["type"]}\n')
        
        # Send email based on type
        notification_type = options['type']
        success = False
        
        try:
            if notification_type == 'cycle_reminder':
                self.stdout.write('Sending Daily Cycle Reminder...')
                result = notification_triggers.on_cycle_data_reminder(user)
                success = result is not None
            elif notification_type == 'fertile_window':
                self.stdout.write('Sending Fertile Window Notification...')
                fertile_start = timezone.now() + timedelta(days=2)
                ovulation_date = fertile_start + timedelta(days=3)
                result = notification_triggers.on_fertile_window_approaching(user, fertile_start, ovulation_date)
                success = result is not None
            elif notification_type == 'period':
                self.stdout.write('Sending Period Prediction...')
                predicted_date = timezone.now() + timedelta(days=3)
                result = notification_triggers.on_period_prediction(user, predicted_date)
                success = result is not None
            elif notification_type == 'ai_analysis':
                self.stdout.write('Sending AI Analysis Result...')
                analysis_result = {
                    'type': 'normal',
                    'message': 'Siklus Anda berjalan normal dan teratur.',
                    'recommendations': [
                        'Lanjutkan pencatatan rutin',
                        'Jaga pola tidur yang baik',
                        'Konsumsi makanan bergizi seimbang',
                        'Kelola stres dengan baik'
                    ],
                    'id': 'test_123'
                }
                result = notification_triggers.on_ai_analysis_complete(user, analysis_result)
                success = result is not None
            elif notification_type == 'partner_mission':
                self.stdout.write('Sending Partner Mission Reminder...')
                result = notification_triggers.on_partner_mission_reminder(user, "Berjalan-jalan Santai Bersama")
                success = result is not None
            elif notification_type == 'simple':
                self.stdout.write('Sending Simple Test Email...')
                email_result = email_service.send_email(
                    to_email=user.email,
                    subject="Test Email - PregCare",
                    html_body="<h1>Test Email</h1><p>This is a test email from PregCare.</p>",
                    plain_text_body="Test Email\n\nThis is a test email from PregCare."
                )
                success = email_result['success']
            
            if success:
                self.stdout.write(self.style.SUCCESS(
                    f'\n✅ SUCCESS! Test email sent to {user.email}\n'
                    f'   Check your inbox (and spam folder)\n'
                ))
            else:
                self.stdout.write(self.style.ERROR(
                    f'\n❌ FAILED! Email could not be sent.\n'
                    f'   Check the logs for details.\n'
                ))
        except Exception as e:
            self.stdout.write(self.style.ERROR(
                f'\n❌ ERROR: {str(e)}\n'
                f'   Make sure your Gmail App Password is correct.\n'
            ))
            import traceback
            self.stdout.write(self.style.ERROR(traceback.format_exc()))
