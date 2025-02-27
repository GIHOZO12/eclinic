from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_groups",  
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions",  
        blank=True
    )
    email=models.EmailField(max_length=120,unique=True)
    is_active=models.BooleanField(default=True)
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['username']
   
    pass
    def __str__(self):
        return self.username
    


class DiseaseAnalyse(models.Model):
    symptoms = models.TextField()  # Store symptoms as a text list
    predicted_disease = models.CharField(max_length=255, blank=True, null=True)  # Store AI results
    analyzed_at = models.DateTimeField(auto_now_add=True)  # Timestamp

    def __str__(self):
        return f"{self.symptoms} -> {self.predicted_disease}"