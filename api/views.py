from django.shortcuts import render
from caredash.models import User
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from api.serializers import SymptomReportSerializer,NotificationSerializer,UserSerializer,HomeSerializer
from caredash.models import Home

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




@api_view(['POST'])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    refresh = RefreshToken.for_user(user)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, email=email, password=password)
    if user:
        # Create JWT token
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
        })
    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensure only logged-in users can access
def user_info(request):
    try:
        profile_info = User.objects.get(username=request.user.username)  # FIXED: Removed `.first()`
        return Response({
            "id": profile_info.id,
            "username": profile_info.username,
            "email": profile_info.email  # Added email for more info
        })
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    



@api_view(["POST"])
def deseasesreport(request):
    request.data['user'] = request.user.id  # Set the user from the logged-in user
    serializer = SymptomReportSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def notifications(request):
    serializer = NotificationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def update_profile(request):
    serializer=UserSerializer(data=request.data,instance=request.user)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
def home(request):
    try:
        home_info = Home.objects.all()
        serializer = HomeSerializer(home_info, many=True)
        return Response(serializer.data)
    except Home.DoesNotExist:
        return Response({"error": "Home not found"}, status=404)
    



    






    






