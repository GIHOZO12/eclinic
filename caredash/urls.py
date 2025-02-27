from django.urls import path

from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('dashboard/',  dashboard, name='dashboard'),
    path('login/', login_page, name='login'),
    path('signup/', register_page, name='signup'),
    path('logout', logout_page, name="logout"),
]