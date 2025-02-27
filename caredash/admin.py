from django.contrib import admin

from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username','email')
    list_filter = ('is_active','is_staff','is_superuser')
    search_fields = ('username','email','phone_number')
    # list_editable=('email')
    list_per_page = 20
