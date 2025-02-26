import os
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
import africastalking

app = Flask(__name__)

# SQLite Database Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(BASE_DIR, "db.sqlite3")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# User Input Model
class USSDSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone_number = db.Column(db.String(20), nullable=False)
    language = db.Column(db.String(10), nullable=False)
    symptoms = db.Column(db.String(200))
    location = db.Column(db.String(100))
    name = db.Column(db.String(50))

# Create the database tables
with app.app_context():
    db.create_all()

# Initialize Africa's Talking SMS
class SMS:
    def __init__(self):
        # Set your app credentials
        self.username = "nshimiefaustinpeace@gmail.com"  # Replace with your Africa's Talking username
        self.api_key = "YOUR_API_KEY"    # Replace with your Africa's Talking API key

        # Initialize the SDK
        africastalking.initialize(self.username, self.api_key)

        # Get the SMS service
        self.sms = africastalking.SMS

    def send(self, message, recipients):
        try:
            # Send the SMS
            response = self.sms.send(message, recipients)
            print(response)
        except Exception as e:
            print(f'Encountered an error while sending: {str(e)}')


@app.route("/ussd", methods=['POST'])
def ussd():
    # Read the variables sent via POST from our API
    session_id = request.values.get("sessionId", None)
    service_code = request.values.get("serviceCode", None)
    phone_number = request.values.get("phoneNumber", None)
    text = request.values.get("text", "default")

    parts = text.split('*')  # Splitting input into steps

    response = ""

    if text == "":  # First screen (Language selection)
        response = "CON Choose your language:\n1. English\n2. Kinyarwanda"
    elif len(parts) == 1:  # Language chosen
        language = "English" if parts[0] == "1" else "Kinyarwanda"
        if language == "English":
            response = "CON Enter the symptoms:"
        else:
            response = "CON Shyiramo ibimenyetso:"
    elif len(parts) == 2:  # Symptoms entered
        language = "English" if parts[0] == "1" else "Kinyarwanda"
        if language == "English":
            response = "CON Enter your location:"
        else:
            response = "CON Shyiramo aho utuye:"
    elif len(parts) == 3:  # Location entered
        language = "English" if parts[0] == "1" else "Kinyarwanda"
        if language == "English":
            response = "CON Enter your name:"
        else:
            response = "CON Shyiramo amazina yawe:"
    elif len(parts) == 4:  # Name entered (last step)
        # Save to Database
        language = "English" if parts[0] == "1" else "Kinyarwanda"
        symptoms = parts[1]
        location = parts[2]
        name = parts[3]

        user = USSDSession(
            phone_number=phone_number,
            language=language,
            symptoms=symptoms,
            location=location,
            name=name
        )
        db.session.add(user)
        db.session.commit()

        # Send SMS after saving data
        sms = SMS()
        message = f"Thank you, {name}! Your details have been saved. Symptoms: {symptoms}, Location: {location}."
        recipients = [phone_number]  # Send SMS to the user's phone number
        sms.send(message, recipients)

        if language == "English":
            response = "END Thank you! Your details have been saved."
        else:
            response = "END Murakoze! Amakuru yawe yabitswe."

    # Send the response back to the API
    return response


if __name__ == '__main__':
    app.run(debug=True)