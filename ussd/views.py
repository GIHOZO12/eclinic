from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import africastalking
from .models import USSDSession  # Ensure the model is imported correctly

# Initialize Africa's Talking
username = "nshimiefaustinpeace@gmail.com"  # Replace with your Africa's Talking username
API_KEY = "atsk_a52c654e6634ffef7583921c7af987efacb64a59ea08379c7e288940ef0dfe1e915d8a36"  # Replace with your API key
africastalking.initialize(username, API_KEY)
sms = africastalking.SMS

@csrf_exempt  # USSD providers send raw POST requests, so we disable CSRF
def ussd(request):
    if request.method == 'POST':
        # Read the variables sent via POST from the API
        session_id = request.POST.get("sessionId", None)
        service_code = request.POST.get("serviceCode", None)
        phone_number = request.POST.get("phoneNumber", None)
        text = request.POST.get("text", "")

        parts = text.split('*')
        response = ""

        if text == "":  # First screen (Language selection)
            response = "CON Choose your language:\n1. English\n2. Kinyarwanda"
        elif len(parts) == 1:  # Language chosen
            language = "English" if parts[0] == "1" else "Kinyarwanda"
            response = "CON Enter the symptoms:" if language == "English" else "CON Shyiramo ibimenyetso:"
        elif len(parts) == 2:  # Symptoms entered
            response = "CON Enter your location:" if parts[0] == "1" else "CON Shyiramo aho utuye:"
        elif len(parts) == 3:  # Location entered
            response = "CON Enter your name:" if parts[0] == "1" else "CON Shyiramo amazina yawe:"
        elif len(parts) == 4:  # Name entered (last step)
            # Save to Database
            language = "English" if parts[0] == "1" else "Kinyarwanda"
            symptoms = parts[1]
            location = parts[2]
            name = parts[3]

            USSDSession.objects.create(
                phone_number=phone_number,
                language=language,
                symptoms=symptoms,
                location=location,
                name=name
            )

            # Send SMS
            message = f"Thank you, {name}! Your details have been saved. Symptoms: {symptoms}, Location: {location}."
            recipients = [phone_number]
            try:
                sms.send(message, recipients)
            except Exception as e:
                print(f"SMS Error: {str(e)}")

            response = "END Thank you! Your details have been saved." if language == "English" else "END Murakoze! Amakuru yawe yabitswe."

        return HttpResponse(response, content_type="text/plain")
    else:
        return HttpResponse("Invalid request method", status=400)