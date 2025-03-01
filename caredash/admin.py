from django.contrib import admin

from .models import User,DiseaseDetection,SymptomReport,Notification,Welcomepage,Home

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username','email')
    list_filter = ('is_active','is_staff','is_superuser')
    search_fields = ('username','email','phone_number')
    # list_editable=('email')
    list_per_page = 20



@admin.register(DiseaseDetection)
class DiseaseDetectionAdmin(admin.ModelAdmin):
    list_display = ('disease_name','common_symptoms','detected_cases','location','created_at')
    list_filter = ('location','created_at')
    search_fields = ('disease_name','common_symptoms','location')
    list_per_page = 20


@admin.register(SymptomReport)
class SymptomReportAdmin(admin.ModelAdmin):
    list_display = ('user','symptoms','location','created_at')
    list_filter = ('user','location','created_at')
    search_fields = ('user__username','user__email','user__phone_number','symptoms','location')
    list_per_page = 20

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('message','sent_at')
    list_filter = ('sent_at',)
    search_fields = ('message',)
    list_per_page = 20



@admin.register(Welcomepage)

class WelcomepageAdmin(admin.ModelAdmin):
    list_display = ('title','image')
    search_fields = ('title',)
    list_per_page = 20


@admin.register(Home)
class HomeAdmin(admin.ModelAdmin):
    list_display = ('title','image')
    search_fields = ('title',)
    list_per_page = 20

