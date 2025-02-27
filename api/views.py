from django.shortcuts import render

# Create your views here.


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import DiseaseAnalyse
from .utility import analyze_symptoms  # Import AI function

@api_view(['POST'])
def analyze_disease(request):
    try:
        symptoms = request.data.get('symptoms', [])

        if not symptoms:
            return Response({"error": "No symptoms provided"}, status=400)
        predicted_disease = analyze_symptoms(symptoms)
        analysis = DiseaseAnalyse.objects.create(
            symptoms=", ".join(symptoms),
            predicted_disease=predicted_disease
        )

        return Response({"predicted_disease": predicted_disease})

    except Exception as e:
        return Response({"error": str(e)}, status=500)

