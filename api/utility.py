DISEASE_DATABASE = {
    ("fever", "cough", "fatigue"): "Flu",
    ("headache", "nausea", "dizziness"): "Migraine",
    ("cough", "shortness of breath", "chest pain"): "Pneumonia",
    ("fever", "rash", "joint pain"): "Dengue",
    ("fatigue", "weight loss", "night sweats"): "Tuberculosis"
}

def analyze_symptoms(symptoms):
    symptoms = set(symptom.lower().strip() for symptom in symptoms)  # Normalize input

    for symptom_set, disease in DISEASE_DATABASE.items():
        if symptoms.issubset(symptom_set):  # Check if user's symptoms match a disease
            return disease

    return "your diseases not detected"
