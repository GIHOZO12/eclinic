from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()
router.register(r'predict-disease', DiseasePredictionViewSet, basename='predict-disease')

urlpatterns = [
    path('home/', home, name='home'),
    path('',  dashboard, name='dashboard'),
    path('login/', login_page, name='login'),
    path('signup/', register_page, name='signup'),
    path('logout', logout_page, name="logout"),
    path("analyze/<int:report_id>/", analyze_report, name="analyze_report"),
    path("current-diseases/", diseases_from_current_symptoms, name="disease_predictions"),
    path('api/', include(router.urls)),


]