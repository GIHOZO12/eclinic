from django.contrib import admin
from .models import User,DiseaseAnalyse

# Register your models here.
@admin.register(User)

class UserAdmin(admin.ModelAdmin):
    list_display = ('username','email')
    list_filter = ('is_active','is_staff','is_superuser')
    search_fields = ('username','email','phone_number')
    # list_editable=('email')
    list_per_page = 20
@admin.register(DiseaseAnalyse)
class DiseaseAnalyseAdmin(admin.ModelAdmin):
    list_display = ('symptoms','predicted_disease','analyzed_at')
    list_filter = ('predicted_disease','analyzed_at')
    search_fields = ('symptoms','predicted_disease')
    list_per_page = 20
