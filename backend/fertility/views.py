from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta, date
from django.db.models import Q

from .models import FertilityProfile, MenstrualCycle, Symptom, CycleAnalysis
from .serializers import (
    FertilityProfileSerializer, 
    MenstrualCycleSerializer, 
    SymptomSerializer, 
    CycleAnalysisSerializer,
    CalendarDataSerializer
)


class FertilityProfileViewSet(viewsets.ModelViewSet):
    """ViewSet untuk Fertility Profile"""
    serializer_class = FertilityProfileSerializer
    # permission_classes = [IsAuthenticated]  # Temporarily disabled
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return FertilityProfile.objects.filter(user=self.request.user)
        return FertilityProfile.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get atau create profile untuk user saat ini"""
        profile, created = FertilityProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'average_cycle_length': 28,
                'average_period_length': 5
            }
        )
        serializer = self.get_serializer(profile)
        return Response(serializer.data)


class MenstrualCycleViewSet(viewsets.ModelViewSet):
    """ViewSet untuk Menstrual Cycle dengan auto-calculation"""
    serializer_class = MenstrualCycleSerializer
    # permission_classes = [IsAuthenticated]  # Temporarily disabled
    
    def get_queryset(self):
        # Return all cycles for now (for testing)
        if self.request.user.is_authenticated:
            return MenstrualCycle.objects.filter(user=self.request.user).order_by('-start_date')
        return MenstrualCycle.objects.all().order_by('-start_date')[:10]
    
    def perform_create(self, serializer):
        # Get user - if not authenticated, try to get first user for testing
        user = self.request.user if self.request.user.is_authenticated else None
        if not user:
            # For testing without auth
            from django.contrib.auth.models import User
            user = User.objects.first()
            if not user:
                from rest_framework.exceptions import ValidationError
                raise ValidationError("No user available. Please login or create a user first.")
        
        # Set is_current=False untuk siklus lain
        MenstrualCycle.objects.filter(user=user, is_current=True).update(is_current=False)
        serializer.save(user=user, is_current=True)
    
    def perform_update(self, serializer):
        """Auto-recalculate saat update"""
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current cycle"""
        cycle = MenstrualCycle.objects.filter(user=request.user, is_current=True).first()
        if not cycle:
            # Ambil yang terakhir
            cycle = MenstrualCycle.objects.filter(user=request.user).first()
        
        if cycle:
            serializer = self.get_serializer(cycle)
            return Response(serializer.data)
        return Response({'message': 'No cycle data found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def quick_log(self, request):
        """Quick log menstruasi dengan tanggal start dan end"""
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        cycle_length = request.data.get('cycle_length', 28)
        
        if not start_date:
            return Response(
                {'error': 'start_date is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get user
        user = request.user if request.user.is_authenticated else None
        if not user:
            # For testing without auth
            from django.contrib.auth.models import User
            user = User.objects.first()
            if not user:
                return Response(
                    {'error': 'No user available. Please login first.'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        # AUTO-CREATE FERTILITY PROFILE if not exists
        profile, created = FertilityProfile.objects.get_or_create(
            user=user,
            defaults={
                'average_cycle_length': cycle_length,
                'average_period_length': 5
            }
        )
        
        if created:
            print(f"[OK] Auto-created FertilityProfile for user {user.username}")
        
        # Parse dates
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            if end_date:
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set is_current=False untuk siklus lain
        MenstrualCycle.objects.filter(user=user, is_current=True).update(is_current=False)
        
        # Create new cycle
        cycle = MenstrualCycle.objects.create(
            user=user,
            start_date=start_date,
            end_date=end_date,
            is_current=True
        )
        cycle.calculate_cycle_data()
        
        # Update profile
        profile.average_cycle_length = cycle_length
        profile.save()
        
        serializer = self.get_serializer(cycle)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['patch'])
    def update_dates(self, request, pk=None):
        """Update tanggal dan auto-recalculate"""
        cycle = self.get_object()
        
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        
        if start_date:
            try:
                cycle.start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid start_date format. Use YYYY-MM-DD'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        if end_date:
            try:
                cycle.end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid end_date format. Use YYYY-MM-DD'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Auto-recalculate
        cycle.calculate_cycle_data()
        
        serializer = self.get_serializer(cycle)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def calendar(self, request):
        """Get calendar data dengan fase per hari untuk bulan tertentu"""
        # Get user
        user = request.user if request.user.is_authenticated else None
        if not user:
            # For testing without auth
            from django.contrib.auth.models import User
            user = User.objects.first()
            if not user:
                return Response({'calendar_data': []})
        
        # Parse year dan month dari query params
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        
        if not year or not month:
            today = date.today()
            year = today.year
            month = today.month
        else:
            year = int(year)
            month = int(month)
        
        # Get first and last day of month
        first_day = date(year, month, 1)
        if month == 12:
            last_day = date(year + 1, 1, 1) - timedelta(days=1)
        else:
            last_day = date(year, month + 1, 1) - timedelta(days=1)
        
        # Get ALL cycles untuk user ini (untuk perhitungan yang lebih akurat)
        cycles = MenstrualCycle.objects.filter(user=user).order_by('-start_date')
        
        # Get current or latest cycle
        current_cycle = cycles.filter(is_current=True).first()
        if not current_cycle and cycles.exists():
            current_cycle = cycles.first()
        
        calendar_data = []
        current_date = first_day
        
        while current_date <= last_day:
            # Get phase for this date from ANY cycle that covers this date
            phase = 'normal'
            cycle_for_date = None
            
            if current_cycle:
                # Check if current cycle covers this date
                phase = current_cycle.get_phase(current_date)
                cycle_for_date = current_cycle
            
            # Check other cycles if needed
            if phase == 'normal' and cycles.exists():
                for cycle in cycles:
                    temp_phase = cycle.get_phase(current_date)
                    if temp_phase != 'normal':
                        phase = temp_phase
                        cycle_for_date = cycle
                        break
            
            # Get symptoms for this date
            symptoms = Symptom.objects.filter(
                user=user,
                date=current_date
            )
            
            symptom_list = [s.symptom_type for s in symptoms]
            
            calendar_data.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'phase': phase,
                'has_symptoms': symptoms.exists(),
                'symptoms': symptom_list,
                'notes': cycle_for_date.notes if cycle_for_date and current_date == cycle_for_date.start_date else ''
            })
            
            current_date += timedelta(days=1)
        
        return Response(calendar_data)


class SymptomViewSet(viewsets.ModelViewSet):
    """ViewSet untuk Symptoms"""
    serializer_class = SymptomSerializer
    # permission_classes = [IsAuthenticated]  # Temporarily disabled
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            queryset = Symptom.objects.filter(user=self.request.user)
        else:
            queryset = Symptom.objects.none()
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def log_multiple(self, request):
        """Log multiple symptoms sekaligus"""
        symptoms_data = request.data.get('symptoms', [])
        date_str = request.data.get('date')
        
        if not date_str:
            date_str = date.today().strftime('%Y-%m-%d')
        
        try:
            symptom_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_symptoms = []
        for symptom_data in symptoms_data:
            symptom = Symptom.objects.create(
                user=request.user,
                date=symptom_date,
                symptom_type=symptom_data.get('symptom_type'),
                category=symptom_data.get('category', 'physical'),
                severity=symptom_data.get('severity'),
                notes=symptom_data.get('notes', '')
            )
            created_symptoms.append(symptom)
        
        serializer = self.get_serializer(created_symptoms, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['delete'])
    def clear_date(self, request):
        """Clear all symptoms untuk tanggal tertentu"""
        date_str = request.query_params.get('date')
        
        if not date_str:
            return Response(
                {'error': 'date parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            symptom_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        deleted_count = Symptom.objects.filter(
            user=request.user,
            date=symptom_date
        ).delete()[0]
        
        return Response({'deleted_count': deleted_count})


class CycleAnalysisViewSet(viewsets.ModelViewSet):
    """ViewSet untuk Cycle Analysis"""
    serializer_class = CycleAnalysisSerializer
    # permission_classes = [IsAuthenticated]  # Temporarily disabled
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return CycleAnalysis.objects.filter(user=self.request.user)
        return CycleAnalysis.objects.none()
    
    @action(detail=False, methods=['post'])
    def generate(self, request):
        """Generate analisis baru berdasarkan history siklus"""
        analysis_data = CycleAnalysis.generate_analysis(request.user)
        
        if analysis_data.get('type') == 'insufficient_data':
            return Response(analysis_data, status=status.HTTP_200_OK)
        
        # Send notification for AI analysis completion
        try:
            from .notifications.services import notification_triggers
            notification_triggers.on_ai_analysis_complete(request.user, analysis_data)
        except Exception as e:
            # Log but don't fail the request
            print(f"[WARN] Failed to send analysis notification: {e}")
        
        # Get the created analysis
        analysis = CycleAnalysis.objects.get(id=analysis_data['id'])
        serializer = self.get_serializer(analysis)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get latest analysis"""
        analysis = CycleAnalysis.objects.filter(user=request.user).first()
        
        if not analysis:
            # Generate if not exists
            analysis_data = CycleAnalysis.generate_analysis(request.user)
            if analysis_data.get('type') == 'insufficient_data':
                return Response(analysis_data, status=status.HTTP_200_OK)
            analysis = CycleAnalysis.objects.get(id=analysis_data['id'])
        
        serializer = self.get_serializer(analysis)
        return Response(serializer.data)
