import json
import numpy as np
import pandas as pd
import os
from django.db.models import Count
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils.timezone import now, timedelta
from django.http import JsonResponse
from .utils import predict_disease
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .serializers import SymptomInputSerializer
from django.conf import settings

from caredash.utils import detect_disease, load_dataset
from .models import *
from .forms import *

def home(request):
    return render(request, 'home.html')

@login_required(login_url='login')
def dashboard(request):
    user_count = User.objects.count()  # Get the total number of 
    symptom_count = SymptomReport.objects.count() 
    # disease_count = DiseaseDetection.objects.count() 
    # notification_count = Notification.objects.count()
    context = {'user_count': user_count,'symptom_count': symptom_count}
    return render(request, 'dashboard.html', context)



def login_page(request):
    page = 'login'
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = User.objects.get(email=email)
            if user.is_active == False:
              
              messages.info(request, "Your accout has been deactivated by administrator. Request to activate")

        except:
            messages.error(request, 'User does not exist')  

        user = authenticate(request, email=email, password=password)

       
        if user is not None:
            login(request, user)
            return redirect('dashboard') 
        else:
            messages.error(request, 'Username or password is not correct') 

    context = {'page': page}
    return render(request, 'login_register.html', context)

def logout_page(request):
    logout(request)
    return redirect('login')


def register_page(request):
    form = MyUserCreationForm()

    if request.method == 'POST':
        form = MyUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            login(request, user)
            return redirect('login')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
            return redirect('signup')

    return render(request, 'login_register.html', {'form': form})


def dashboard(request):
    user_count = User.objects.count()
    symptom_count = SymptomReport.objects.count()
    detected_disease_count = DiseaseDetection.objects.count()
    new_reports_count = SymptomReport.objects.filter(created_at__gte=now()-timedelta(days=7)).count()
    
    recent_reports = SymptomReport.objects.order_by('-created_at')[:5]
    
    # Prepare data for disease trends chart
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    reported_cases = [DiseaseDetection.objects.filter(created_at__month=i+1).count() for i in range(12)]

    context = {
        'user_count': user_count,
        'symptom_count': symptom_count,
        'detected_disease_count': detected_disease_count,
        'new_reports_count': new_reports_count,
        'recent_reports': recent_reports,
        'months': months,
        'reported_cases': reported_cases,
    }

    return render(request, 'dashboard.html', context)


# Load the dataset to map symptoms to binary values
CSV_PATH = os.path.join("media", "datasets", "disease_symptoms.csv")  # Adjust filename
df = pd.read_csv(CSV_PATH)

# Get list of all symptoms from the dataset
all_symptoms = df.columns[1:].tolist()  # Skip the 'Disease' column

def analyze_report(request, report_id):
    """
    View to analyze a SymptomReport and predict the disease.
    """
    try:
        report = SymptomReport.objects.get(id=report_id)
        reported_symptoms = report.symptoms.split(", ")  # Example: ["Headache", "Fever"]

        # Convert reported symptoms to binary format
        symptoms_binary = [1 if symptom in reported_symptoms else 0 for symptom in all_symptoms]

        # Predict disease using AI
        predicted_disease = predict_disease(symptoms_binary)

        return JsonResponse({"predicted_disease": predicted_disease})
    except SymptomReport.DoesNotExist:
        return JsonResponse({"error": "Report not found"}, status=404)
    

def diseases_from_current_symptoms(request):
    """
    View to display possible diseases based on the most reported symptoms.
    """
    # Get the most frequently reported symptoms
    symptom_counts = SymptomReport.objects.values("symptoms").annotate(count=Count("id")).order_by("-count")

    # Extract unique symptoms
    current_symptoms = set()
    for entry in symptom_counts:
        symptoms = [s.strip().lower() for s in entry["symptoms"].split(",")]  # Normalize symptoms
        current_symptoms.update(symptoms)

    print("CURRENT SYMPTOMS:", current_symptoms)  # Debugging

    # Find matching diseases
    matched_diseases = []
    for disease in DiseaseDetection.objects.all():
        disease_symptoms = {s.strip().lower() for s in disease.common_symptoms.split(",")}  # Normalize symptoms
        if current_symptoms.intersection(disease_symptoms):  # If there's a match
            matched_diseases.append({
                "name": disease.disease_name,
                "common_symptoms": disease.common_symptoms,
                "detected_cases": disease.detected_cases,
                "location": disease.location
            })

    print("MATCHED DISEASES:", matched_diseases)  # Check the output in terminal

    return render(request, "disease_list.html", {
        "matched_diseases": matched_diseases,
        "current_symptoms": current_symptoms
    })



class DiseasePredictionViewSet(ModelViewSet):
    serializer_class = SymptomInputSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        """Optional: Define a queryset if needed (not used for AI predictions)."""
        return []

    def create(self, request, *args, **kwargs):
        """Handles POST requests for disease prediction."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            symptoms = serializer.validated_data['symptoms']

            # Load dataset
            dataset_path = os.path.join(settings.MEDIA_ROOT, 'datasets', 'disease_symptoms.csv')
            df = pd.read_csv(dataset_path)

            # Extract symptom columns
            symptom_cols = df.columns[1:]  # Assuming first column is 'Disease'

            # Create input vector (binary encoding)
            input_vector = np.zeros(len(symptom_cols), dtype=int)
            for symptom in symptoms:
                if symptom in symptom_cols:
                    input_vector[np.where(symptom_cols == symptom)[0][0]] = 1

            # Find the closest match
            df_symptoms = df.iloc[:, 1:].values  # Exclude 'Disease' column
            distances = np.sum(df_symptoms == input_vector, axis=1)
            best_match_index = np.argmax(distances)
            predicted_disease = df.iloc[best_match_index, 0]  # Get disease name

            return Response({"predicted_disease": predicted_disease}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request, *args, **kwargs):
        """Handles GET requests (Returns available symptoms)."""
        dataset_path = os.path.join(settings.MEDIA_ROOT, 'datasets', 'disease_symptoms.csv')
        df = pd.read_csv(dataset_path)
        symptoms = list(df.columns[1:])
        return Response({"available_symptoms": symptoms}, status=status.HTTP_200_OK)
