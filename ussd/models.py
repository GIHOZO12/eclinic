from django.db import models

class USSDSession(models.Model):
    phone_number = models.CharField(max_length=20)
    language = models.CharField(max_length=10)
    symptoms = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.phone_number})"
