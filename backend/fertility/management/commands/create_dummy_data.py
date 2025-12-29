"""
Django management command untuk generate dummy fertility data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from fertility.models import FertilityProfile, MenstrualCycle, Symptom, CycleAnalysis
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Generate dummy fertility tracking data for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--user',
            type=str,
            default='admin',
            help='Username to create dummy data for'
        )
        parser.add_argument(
            '--cycles',
            type=int,
            default=6,
            help='Number of menstrual cycles to create'
        )

    def handle(self, *args, **options):
        username = options['user']
        num_cycles = options['cycles']

        self.stdout.write(f'Creating dummy data for user: {username}')

        # Get or create user
        try:
            user = User.objects.get(username=username)
            self.stdout.write(self.style.SUCCESS(f'[OK] Found user: {user.username}'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'[ERROR] User {username} not found!'))
            self.stdout.write('Creating user...')
            user = User.objects.create_user(
                username=username,
                email=f'{username}@test.com',
                password='admin123',
                first_name='Test',
                last_name='User'
            )
            self.stdout.write(self.style.SUCCESS(f'[OK] Created user: {username}'))

        # Delete existing data for fresh start
        self.stdout.write('Deleting existing fertility data...')
        FertilityProfile.objects.filter(user=user).delete()
        MenstrualCycle.objects.filter(user=user).delete()
        Symptom.objects.filter(user=user).delete()
        CycleAnalysis.objects.filter(user=user).delete()
        self.stdout.write(self.style.SUCCESS('[OK] Cleared existing data'))

        # Create fertility profile
        profile = FertilityProfile.objects.create(
            user=user,
            average_cycle_length=28,
            average_period_length=5
        )
        self.stdout.write(self.style.SUCCESS(f'[OK] Created fertility profile'))

        # Create menstrual cycles (going backwards from today)
        cycles_created = []
        current_date = datetime.now().date()
        
        for i in range(num_cycles):
            # Calculate cycle dates going backwards
            cycle_start = current_date - timedelta(days=i * 28 + random.randint(-3, 3))
            cycle_length = random.randint(25, 32)
            period_length = random.randint(3, 7)
            period_end = cycle_start + timedelta(days=period_length)
            
            cycle = MenstrualCycle.objects.create(
                user=user,
                start_date=cycle_start,
                end_date=period_end,
                cycle_length=cycle_length
            )
            # Auto-calculation happens in save method
            cycles_created.append(cycle)
            
            self.stdout.write(self.style.SUCCESS(
                f'[OK] Created cycle {i+1}: {cycle.start_date} to {cycle.end_date} '
                f'(ovulation: {cycle.ovulation_date}, fertile: {cycle.fertile_window_start} - {cycle.fertile_window_end})'
            ))

            # Add symptoms for each cycle
            symptoms_added = self.create_symptoms_for_cycle(user, cycle)
            self.stdout.write(f'  → Added {symptoms_added} symptom logs')

        # Generate cycle analysis
        analysis_result = CycleAnalysis.generate_analysis(user)
        if analysis_result:
            self.stdout.write(self.style.SUCCESS(
                f'[OK] Generated cycle analysis: {analysis_result.get("type", "unknown")}'
            ))
            self.stdout.write(f'  Message: {analysis_result.get("message", "")[:80]}...')
            self.stdout.write(f'  Confidence: {analysis_result.get("confidence", "N/A")}')
        else:
            self.stdout.write(self.style.WARNING('[WARN] Not enough cycles for analysis'))

        # Summary
        self.stdout.write(self.style.SUCCESS(f'\n{"="*60}'))
        self.stdout.write(self.style.SUCCESS(f'DUMMY DATA GENERATED SUCCESSFULLY!'))
        self.stdout.write(self.style.SUCCESS(f'{"="*60}'))
        self.stdout.write(f'User: {user.username}')
        self.stdout.write(f'Cycles created: {len(cycles_created)}')
        self.stdout.write(f'Total symptoms: {Symptom.objects.filter(user=user).count()}')
        self.stdout.write(f'Analysis: {analysis_result.get("type") if analysis_result else "N/A"}')
        self.stdout.write(f'\nLogin credentials:')
        self.stdout.write(f'  Username: {username}')
        self.stdout.write(f'  Password: admin123')
        self.stdout.write(self.style.SUCCESS(f'{"="*60}\n'))

    def create_symptoms_for_cycle(self, user, cycle):
        """Create random symptoms for a cycle"""
        symptom_types = [
            'cramps', 'headache', 'backpain', 'bloating', 'fatigue',
            'breast_tender', 'acne', 'nausea', 'happy', 'sad',
            'irritable', 'anxious', 'mood_swings', 'energetic',
            'cravings', 'insomnia', 'heavy_flow', 'medium_flow',
            'light_flow', 'spotting'
        ]
        
        symptoms_created = 0
        
        # Add symptoms during period (start_date to end_date)
        period_days = (cycle.end_date - cycle.start_date).days + 1
        for day_offset in range(period_days):
            symptom_date = cycle.start_date + timedelta(days=day_offset)
            
            # Period symptoms (more likely)
            if random.random() > 0.3:  # 70% chance
                for _ in range(random.randint(2, 5)):
                    symptom_type = random.choice([
                        'cramps', 'fatigue', 'headache', 'backpain',
                        'heavy_flow', 'medium_flow', 'mood_swings'
                    ])
                    Symptom.objects.create(
                        user=user,
                        date=symptom_date,
                        symptom_type=symptom_type,
                        severity=random.randint(5, 9),  # Moderate to severe during period
                        category='physical'
                    )
                    symptoms_created += 1
        
        # Add symptoms during fertile window
        if cycle.fertile_window_start and cycle.fertile_window_end:
            fertile_days = (cycle.fertile_window_end - cycle.fertile_window_start).days + 1
            for day_offset in range(fertile_days):
                symptom_date = cycle.fertile_window_start + timedelta(days=day_offset)
                
                if random.random() > 0.5:  # 50% chance
                    for _ in range(random.randint(1, 3)):
                        symptom_type = random.choice([
                            'energetic', 'happy', 'bloating', 'breast_tender'
                        ])
                        Symptom.objects.create(
                            user=user,
                            date=symptom_date,
                            symptom_type=symptom_type,
                            severity=random.randint(2, 5),  # Mild to moderate during fertile window
                            category='mood' if symptom_type in ['energetic', 'happy'] else 'physical'
                        )
                        symptoms_created += 1
        
        # Random symptoms on other days
        other_days = random.randint(2, 5)
        for _ in range(other_days):
            random_day = random.randint(1, cycle.cycle_length - 1)
            symptom_date = cycle.start_date + timedelta(days=random_day)
            
            # Avoid duplicating dates already covered
            if cycle.start_date <= symptom_date <= cycle.end_date:
                continue
            if cycle.fertile_window_start and cycle.fertile_window_end:
                if cycle.fertile_window_start <= symptom_date <= cycle.fertile_window_end:
                    continue
            
            symptom_type = random.choice(symptom_types)
            # Determine category based on symptom type
            if symptom_type in ['cramps', 'headache', 'backpain', 'bloating', 'fatigue', 'breast_tender', 'acne', 'nausea']:
                category = 'physical'
            elif symptom_type in ['happy', 'sad', 'irritable', 'anxious', 'mood_swings', 'energetic']:
                category = 'mood'
            elif symptom_type in ['heavy_flow', 'medium_flow', 'light_flow', 'spotting']:
                category = 'flow'
            else:
                category = 'other'
            
            Symptom.objects.create(
                user=user,
                date=symptom_date,
                symptom_type=symptom_type,
                severity=random.randint(1, 10),  # Random severity
                category=category
            )
            symptoms_created += 1
        
        return symptoms_created
