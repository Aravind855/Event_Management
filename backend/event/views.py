from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from backend.settings import MONGODB_DB
import json
import google.generativeai as genai
import datetime
from datetime import datetime as dt

def test_mongo_connection(request):
    try:
        collection = MONGODB_DB.test_collection
        collection.insert_one({"test": "connection successful"})
        return JsonResponse({"status": "MongoDB connection successful"})
    except Exception as e:
        return JsonResponse({"status": "Connection failed", "error": str(e)})

@csrf_exempt
def user_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            if not all([name, email, password]):
                return JsonResponse({"status": "error", "message": "All fields are required"}, status=400)

            users_collection = MONGODB_DB.users
            if users_collection.find_one({"email": email}):
                return JsonResponse({"status": "error", "message": "Email already exists"}, status=400)

            users_collection.insert_one({
                "name": name,
                "email": email,
                "password": password,
                "role": "user"
            })
            return JsonResponse({"status": "success", "message": "User created successfully"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@csrf_exempt
def admin_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            if not all([name, email, password]):
                return JsonResponse({"status": "error", "message": "All fields are required"}, status=400)

            users_collection = MONGODB_DB.users
            if users_collection.find_one({"email": email}):
                return JsonResponse({"status": "error", "message": "Email already exists"}, status=400)

            users_collection.insert_one({
                "name": name,
                "email": email,
                "password": password,
                "role": "admin"
            })
            return JsonResponse({"status": "success", "message": "Admin created successfully"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@csrf_exempt
def create_event(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            eventTitle = data.get('eventTitle')
            eventVenue = data.get('eventVenue')
            eventStartTime = data.get('eventStartTime')
            eventEndTime = data.get('eventEndTime')
            eventStartDate = data.get('eventStartDate')
            eventEndDate = data.get('eventEndDate')
            eventCost = data.get('eventCost')
            eventDescription = data.get('eventDescription')
            imageBase64 = data.get('imageBase64')

            if not all([eventTitle, eventVenue, eventStartTime, eventEndTime, eventStartDate, eventEndDate, eventCost, eventDescription]):
                return JsonResponse({"status": "error", "message": "All fields are required"}, status=400)

            events_collection = MONGODB_DB.events
            events_collection.insert_one({
                "eventTitle": eventTitle,
                "eventVenue": eventVenue,
                "eventStartTime": eventStartTime,
                "eventEndTime": eventEndTime,
                "eventStartDate": eventStartDate,
                "eventEndDate": eventEndDate,
                "eventCost": eventCost,
                "eventDescription": eventDescription,
                "imageBase64": imageBase64 or "",
                "createdAt": datetime.datetime.utcnow()
            })
            return JsonResponse({"status": "success", "message": "Event created successfully"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@csrf_exempt
def get_events(request):
    if request.method == 'GET':
        try:
            events_collection = MONGODB_DB.events
            events = list(events_collection.find().sort("createdAt", -1))
            for event in events:
                event["_id"] = str(event["_id"])
            return JsonResponse({"status": "success", "events": events})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@csrf_exempt
def generate_event_description(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            eventTitle = data.get('eventTitle', '')
            eventVenue = data.get('eventVenue', '')
            eventStartTime = data.get('eventStartTime', '')
            eventEndTime = data.get('eventEndTime', '')
            eventStartDate = data.get('eventStartDate', '')
            eventEndDate = data.get('eventEndDate', '')
            eventCost = data.get('eventCost', '')

            # Convert dates to dd-mm-yyyy format
            start_date = dt.strptime(eventStartDate, '%Y-%m-%d').strftime('%d-%m-%Y') if eventStartDate else ''
            end_date = dt.strptime(eventEndDate, '%Y-%m-%d').strftime('%d-%m-%Y') if eventEndDate else ''

            # Configure Gemini API
            genai.configure(api_key="AIzaSyCtjSq3VUgjJZd8R0rglUZidWNmUsnRz98")  # Replace with your API key
            model = genai.GenerativeModel("gemini-2.0-flash")

            # Generate description
            prompt = f"Generate an event description based on the following details:\n" \
                     f"- Event Title: {eventTitle}\n" \
                     f"- Event Venue: {eventVenue}\n" \
                     f"- Start Time: {eventStartTime}\n" \
                     f"- End Time: {eventEndTime}\n" \
                     f"- Start Date: {start_date}\n" \
                     f"- End Date: {end_date}\n" \
                     f"- Event Cost: ${eventCost}\n" \
                     f"Join us for an exciting event!"
            f"just return the description without any additional text. avoid using any markdown or code formatting and symbols."
        
            response = model.generate_content(prompt)
            description = response.text.strip()

            return JsonResponse({"status": "success", "description": description})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

def home(request):
    return JsonResponse({"message": "Welcome to the Event Backend API!"})

def favicon_redirect(request):
    return JsonResponse({"status": "favicon not implemented"}, status=404)