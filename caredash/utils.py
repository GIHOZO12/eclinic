from .models import DiseaseDetection, Notification
import pandas as pd
import os
from django.conf import settings
import pandas as pd
import os
import numpy as np
from django.conf import settings
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
import joblib 

def load_dataset():
    """Loads the disease-symptom dataset from the CSV file."""
    dataset_path = os.path.join(settings.MEDIA_ROOT, "datasets/disease_symptoms.csv")
    
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")
    
    df = pd.read_csv(dataset_path)
    diseases = df.iloc[:, 0]  # First column is disease name
    symptoms = df.iloc[:, 1:]  # Remaining columns are symptoms (0 or 1)

    return diseases, symptoms, df


def train_disease_model():
    """
    Trains an AI model using the symptom dataset and saves the model.
    """
    dataset_path = os.path.join(settings.MEDIA_ROOT, 'datasets', 'disease_symptoms.csv')
    df = pd.read_csv(dataset_path)

    X = df.iloc[:, 1:].values  # Symptoms (binary)
    y = df.iloc[:, 0].values   # Disease names

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Choose a model: Decision Tree or Logistic Regression
    model = DecisionTreeClassifier()  # You can also try LogisticRegression()

    # Train the model
    model.fit(X_train, y_train)

    # Save the trained model
    model_path = os.path.join(settings.MEDIA_ROOT, 'models', 'disease_model.pkl')
    joblib.dump(model, model_path)

    return "Model trained and saved successfully!"

def predict_disease(symptoms):
    """
    Predicts a disease based on symptoms using the trained AI model.
    """
    model_path = os.path.join(settings.MEDIA_ROOT, 'models', 'disease_model.pkl')

    if not os.path.exists(model_path):
        return "No trained model found! Train the model first."

    # Load the trained model
    model = joblib.load(model_path)

    # Convert symptoms to the required format
    symptoms = np.array(symptoms).reshape(1, -1)  # Reshape for prediction

    # Predict disease
    predicted_disease = model.predict(symptoms)

    return predicted_disease[0]



def detect_disease(symptom_report):
    """
    Matches a SymptomReport with possible diseases based on symptoms.
    """
    reported_symptoms = set(symptom_report.symptoms.lower().split(", "))  # Normalize input
    possible_diseases = DiseaseDetection.objects.all()
    
    disease_matches = {}

    for disease in possible_diseases:
        disease_symptoms = set(disease.common_symptoms.lower().split(", "))
        matching_symptoms = reported_symptoms.intersection(disease_symptoms)
        
        if matching_symptoms:
            match_percentage = (len(matching_symptoms) / len(disease_symptoms)) * 100
            disease_matches[disease.disease_name] = match_percentage

    sorted_diseases = sorted(disease_matches.items(), key=lambda x: x[1], reverse=True)
    return sorted_diseases


def detect_disease_and_notify(symptom_report):
    detected_diseases = detect_disease(symptom_report)
    
    if detected_diseases:
        most_likely_disease, confidence = detected_diseases[0]

        if confidence > 70:  # If confidence is above 70%, send a notification
            notification = Notification.objects.create(
                message=f"We detected a high probability of {most_likely_disease} based on your symptoms. Please seek medical advice.",
            )
            notification.recipients.add(symptom_report.user)
    
    return detected_diseases

