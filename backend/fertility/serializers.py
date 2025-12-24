from rest_framework import serializers
from .models import FertilityProfile, MenstrualCycle, Symptom, CycleAnalysis
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class FertilityProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = FertilityProfile
        fields = ['id', 'user', 'average_cycle_length', 'average_period_length', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class MenstrualCycleSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    phase = serializers.SerializerMethodField()
    
    class Meta:
        model = MenstrualCycle
        fields = [
            'id', 'user', 'start_date', 'end_date', 'cycle_length', 'period_length',
            'ovulation_date', 'fertile_window_start', 'fertile_window_end', 
            'next_period_date', 'is_current', 'notes', 'phase',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'ovulation_date', 
                           'fertile_window_start', 'fertile_window_end', 'next_period_date']
    
    def get_phase(self, obj):
        from datetime import date
        return obj.get_phase(date.today())
    
    def create(self, validated_data):
        cycle = MenstrualCycle.objects.create(**validated_data)
        cycle.calculate_cycle_data()
        return cycle
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.calculate_cycle_data()
        return instance


class SymptomSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Symptom
        fields = ['id', 'user', 'date', 'symptom_type', 'category', 'severity', 'notes', 'created_at']
        read_only_fields = ['created_at']


class CycleAnalysisSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CycleAnalysis
        fields = [
            'id', 'user', 'analysis_date', 'average_cycle_length', 
            'cycle_variability', 'analysis_type', 'message', 
            'recommendations', 'potential_causes', 'cycles_analyzed',
            'confidence_level', 'created_at'
        ]
        read_only_fields = ['created_at']


class CalendarDataSerializer(serializers.Serializer):
    """Serializer untuk data kalender dengan fase per hari"""
    date = serializers.DateField()
    phase = serializers.CharField()
    has_symptoms = serializers.BooleanField()
    symptoms = serializers.ListField(child=serializers.CharField())
    notes = serializers.CharField(allow_blank=True)
