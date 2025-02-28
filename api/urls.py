from django.urls import path
from api import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('analyze_disease/', views.analyze_disease, name='analyze_disease'),

     path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("user_info/",views.user_info,name="user_info"),
    path("symptomreport/", views.deseasesreport, name="symptom_report"),
    path("notifications/", views.notifications, name="notifications"),
    path("update_profile/", views.update_profile, name="update_profile"),
]