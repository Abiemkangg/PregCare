"""
Generate multiple dummy users dengan data fertility lengkap
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from fertility.models import FertilityProfile, MenstrualCycle, Symptom, CycleAnalysis
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Generate multiple dummy users with fertility data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=3,
            help='Number of users to create'
        )

    def handle(self, *args, **options):
        count = options['count']
        
        users_data = [
            {'username': 'admin', 'email': 'admin@pregcare.com', 'first_name': 'Admin', 'last_name': 'PregCare'},
            {'username': 'siti', 'email': 'siti@test.com', 'first_name': 'Siti', 'last_name': 'Nurhaliza'},
            {'username': 'rani', 'email': 'rani@test.com', 'first_name': 'Rani', 'last_name': 'Wijaya'},
            {'username': 'dewi', 'email': 'dewi@test.com', 'first_name': 'Dewi', 'last_name': 'Lestari'},
            {'username': 'maya', 'email': 'maya@test.com', 'first_name': 'Maya', 'last_name': 'Sari'},
        ]
        
        self.stdout.write(self.style.SUCCESS('='*70))
        self.stdout.write(self.style.SUCCESS('GENERATING DUMMY USERS WITH FERTILITY DATA'))
        self.stdout.write(self.style.SUCCESS('='*70))
        self.stdout.write('')
        
        created_users = []
        
        for i, user_data in enumerate(users_data[:count]):
            self.stdout.write(f'\n[{i+1}/{count}] Creating user: {user_data["username"]}')
            self.stdout.write('-' * 70)
            
            # Create or update user
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name']
                }
            )
            
            if not created:
                user.email = user_data['email']
                user.first_name = user_data['first_name']
                user.last_name = user_data['last_name']
                user.save()
            
            # Set password
            user.set_password('admin123')
            user.save()
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'  [OK] Created new user: {user.username}'))
            else:
                self.stdout.write(self.style.WARNING(f'  ⟳ Updated existing user: {user.username}'))
            
            # Delete existing fertility data
            FertilityProfile.objects.filter(user=user).delete()
            MenstrualCycle.objects.filter(user=user).delete()
            Symptom.objects.filter(user=user).delete()
            CycleAnalysis.objects.filter(user=user).delete()
            
            # Create fertility profile
            avg_cycle = random.randint(26, 32)
            profile = FertilityProfile.objects.create(
                user=user,
                average_cycle_length=avg_cycle,
                average_period_length=random.randint(4, 6)
            )
            self.stdout.write(f'  [OK] Created profile (avg cycle: {avg_cycle} days)')
            
            # Create cycles
            num_cycles = random.randint(4, 8)
            current_date = datetime.now().date()
            cycles_created = []
            total_symptoms = 0
            
            for j in range(num_cycles):
                cycle_start = current_date - timedelta(days=j * avg_cycle + random.randint(-3, 3))
                period_length = random.randint(3, 7)
                cycle_length = random.randint(25, 33)
                period_end = cycle_start + timedelta(days=period_length)
                
                cycle = MenstrualCycle.objects.create(
                    user=user,
                    start_date=cycle_start,
                    end_date=period_end,
                    cycle_length=cycle_length
                )
                cycles_created.append(cycle)
                
                # Add symptoms
                symptom_count = self.create_symptoms_for_cycle(user, cycle)
                total_symptoms += symptom_count
            
            self.stdout.write(f'  [OK] Created {num_cycles} cycles with {total_symptoms} symptoms')
            
            # Generate analysis
            analysis_result = CycleAnalysis.generate_analysis(user)
            if analysis_result:
                self.stdout.write(f'  [OK] Generated analysis: {analysis_result.get("type")}')
            
            created_users.append({
                'username': user.username,
                'email': user.email,
                'cycles': num_cycles,
                'symptoms': total_symptoms
            })
        
        # Summary
        self.stdout.write('\n')
        self.stdout.write(self.style.SUCCESS('='*70))
        self.stdout.write(self.style.SUCCESS('SUMMARY - DUMMY USERS CREATED'))
        self.stdout.write(self.style.SUCCESS('='*70))
        self.stdout.write('\nLogin credentials for all users:')
        self.stdout.write(self.style.WARNING('  Password: admin123 (same for all)\n'))
        
        for user_info in created_users:
            self.stdout.write(f"  {user_info['username']:12} | {user_info['email']:25} | "
                            f"{user_info['cycles']} cycles, {user_info['symptoms']} symptoms")
        
        self.stdout.write('\n' + self.style.SUCCESS('='*70))
        self.stdout.write(self.style.SUCCESS(f'Total users created: {len(created_users)}'))
        self.stdout.write(self.style.SUCCESS('='*70) + '\n')

    def create_symptoms_for_cycle(self, user, cycle):
        """Create random symptoms for a cycle"""
        symptoms_config = {
            'physical': ['cramps', 'headache', 'backpain', 'bloating', 'fatigue', 'breast_tender', 'acne', 'nausea'],
            'mood': ['happy', 'sad', 'irritable', 'anxious', 'mood_swings', 'energetic'],
            'flow': ['heavy_flow', 'medium_flow', 'light_flow', 'spotting'],
            'other': ['cravings', 'insomnia']
        }
        
        symptoms_created = 0
        
        # Period symptoms
        period_days = (cycle.end_date - cycle.start_date).days + 1
        for day_offset in range(period_days):
            symptom_date = cycle.start_date + timedelta(days=day_offset)
            
            if random.random() > 0.4:  # 60% chance
                num_symptoms = random.randint(2, 4)
                for _ in range(num_symptoms):
                    symptom_type = random.choice(symptoms_config['physical'][:4] + symptoms_config['flow'])
                    category = 'flow' if symptom_type in symptoms_config['flow'] else 'physical'
                    
                    Symptom.objects.create(
                        user=user,
                        date=symptom_date,
                        symptom_type=symptom_type,
                        severity=random.randint(5, 9),
                        category=category
                    )
                    symptoms_created += 1
        
        # Fertile window symptoms
        if cycle.fertile_window_start and cycle.fertile_window_end:
            fertile_days = (cycle.fertile_window_end - cycle.fertile_window_start).days + 1
            for day_offset in range(fertile_days):
                symptom_date = cycle.fertile_window_start + timedelta(days=day_offset)
                
                if random.random() > 0.6:  # 40% chance
                    symptom_type = random.choice(['energetic', 'happy', 'bloating', 'breast_tender'])
                    category = 'mood' if symptom_type in symptoms_config['mood'] else 'physical'
                    
                    Symptom.objects.create(
                        user=user,
                        date=symptom_date,
                        symptom_type=symptom_type,
                        severity=random.randint(2, 5),
                        category=category
                    )
                    symptoms_created += 1
        
        # Random other symptoms
        for _ in range(random.randint(1, 3)):
            random_day = random.randint(1, cycle.cycle_length - 1)
            symptom_date = cycle.start_date + timedelta(days=random_day)
            
            # Skip if already covered
            if cycle.start_date <= symptom_date <= cycle.end_date:
                continue
            if cycle.fertile_window_start and cycle.fertile_window_end:
                if cycle.fertile_window_start <= symptom_date <= cycle.fertile_window_end:
                    continue
            
            all_symptoms = []
            for symptoms in symptoms_config.values():
                all_symptoms.extend(symptoms)
            
            symptom_type = random.choice(all_symptoms)
            
            # Determine category
            for cat, symptoms in symptoms_config.items():
                if symptom_type in symptoms:
                    category = cat
                    break
            
            Symptom.objects.create(
                user=user,
                date=symptom_date,
                symptom_type=symptom_type,
                severity=random.randint(1, 10),
                category=category
            )
            symptoms_created += 1
        
        return symptoms_created
