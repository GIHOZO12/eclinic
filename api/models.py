from django.db import models

class DiseaseAnalyse(models.Model):
    symptoms = models.TextField()  # Store symptoms as a text list
    predicted_disease = models.CharField(max_length=255, blank=True, null=True)  # Store AI results
    analyzed_at = models.DateTimeField(auto_now_add=True)  # Timestamp

    def __str__(self):
        return f"{self.symptoms} -> {self.predicted_disease}"