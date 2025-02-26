from django.urls import path
from .views import ussd

urlpatterns = [
    path('ussd/', ussd, name='ussd'),
]
