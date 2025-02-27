from django.contrib import admin
from .models import DiseaseAnalyse


@admin.register(DiseaseAnalyse)
class DiseaseAnalyseAdmin(admin.ModelAdmin):
    list_display = ('symptoms','predicted_disease','analyzed_at')
    list_filter = ('predicted_disease','analyzed_at')
    search_fields = ('symptoms','predicted_disease')
    list_per_page = 20
