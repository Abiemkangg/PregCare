from django.contrib import admin
from .models import FertilityProfile, MenstrualCycle, Symptom, CycleAnalysis


@admin.register(FertilityProfile)
class FertilityProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'average_cycle_length', 'average_period_length', 'created_at']
    search_fields = ['user__username', 'user__email']
    list_filter = ['created_at']


@admin.register(MenstrualCycle)
class MenstrualCycleAdmin(admin.ModelAdmin):
    list_display = ['user', 'start_date', 'end_date', 'cycle_length', 'is_current', 'created_at']
    search_fields = ['user__username']
    list_filter = ['is_current', 'start_date']
    date_hierarchy = 'start_date'


@admin.register(Symptom)
class SymptomAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'symptom_type', 'category', 'severity']
    search_fields = ['user__username', 'symptom_type']
    list_filter = ['category', 'date']
    date_hierarchy = 'date'


@admin.register(CycleAnalysis)
class CycleAnalysisAdmin(admin.ModelAdmin):
    list_display = ['user', 'analysis_date', 'analysis_type', 'average_cycle_length', 'confidence_level']
    search_fields = ['user__username']
    list_filter = ['analysis_type', 'confidence_level', 'analysis_date']
    date_hierarchy = 'analysis_date'
