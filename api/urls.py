from django.urls import path
from api import views

urlpatterns = [
    path('analyze_disease/', views.analyze_disease, name='analyze_disease'),
]