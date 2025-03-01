from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):
    name = models.CharField(max_length=255)
    last_name=models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    location = models.CharField(max_length=200)
    profile_pic = models.ImageField(upload_to='profile_pics', blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
class SymptomReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    symptoms = models.TextField()  # Example: "Cough, Fever, Fatigue"
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user} - {self.symptoms} ({self.location})"   

class DiseaseDetection(models.Model):
    disease_name = models.CharField(max_length=50)
    common_symptoms = models.TextField()
    detected_cases = models.IntegerField(default=0)
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.disease_name} - {self.detected_cases} cases ({self.location})"
    

class Notification(models.Model):
    receipients=models.ManyToManyField(User, related_name='notifications')
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.message   
    
class Home(models.Model):
    title=models.CharField(max_length=200)
    image=models.ImageField(upload_to='home')
    def __str__(self):
        return self.title


class Welcomepage(models.Model):
    title=models.CharField(max_length=200)
    image=models.ImageField(upload_to='welcomepage')
    def __str__(self):
        return self.title









