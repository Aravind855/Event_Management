from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from backend.settings import MONGODB_DB
import json
import google.generativeai as genai
import datetime
from datetime import datetime as dt
from bson.objectid import ObjectId
# JWT Imports
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .authentication import MongoJWTAuthentication  # Import the custom authentication class
from rest_framework_simplejwt.authentication import JWTAuthentication

# --- Helper function to get tokens for a user ---
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# --- User and Admin Signup (No changes needed) ---
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

# --- UPDATED Login Views ---
@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def user_login(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')
    users_collection = MONGODB_DB.users
    user = users_collection.find_one({"email": email, "password": password, "role": "user"})
    
    if user:
        # CORRECTED: Add the 'id' attribute to the temporary user object
        user_id_str = str(user['_id'])
        user_for_token = type('User', (), {'pk': user_id_str, 'id': user_id_str})()
        tokens = get_tokens_for_user(user_for_token)
        return JsonResponse({"status": "success", "message": "Login successful", "tokens": tokens})
    else:
        return JsonResponse({"status": "error", "message": "Invalid credentials."}, status=401)

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def admin_login(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')
    users_collection = MONGODB_DB.users
    admin = users_collection.find_one({"email": email, "password": password, "role": "admin"})
    
    if admin:
        # CORRECTED: Add the 'id' attribute to the temporary admin object
        admin_id_str = str(admin['_id'])
        admin_for_token = type('Admin', (), {'pk': admin_id_str, 'id': admin_id_str, 'name': admin['name']})()
        tokens = get_tokens_for_user(admin_for_token)
        return JsonResponse({"status": "success", "message": "Admin login successful", "tokens": tokens, "adminName": admin['name']})
    else:
        return JsonResponse({"status": "error", "message": "Invalid credentials."}, status=401)

# --- Secured Event Views ---
@csrf_exempt
@api_view(['POST'])
@authentication_classes([MongoJWTAuthentication])
@permission_classes([IsAuthenticated])
def create_event(request):
    try:
        data = json.loads(request.body)
        admin_id = request.user.id  # This will now work with MongoDB ObjectId
        admin_user = MONGODB_DB.users.find_one({"_id": ObjectId(admin_id)})
        if not admin_user or admin_user.get('role') != 'admin':
            return JsonResponse({"status": "error", "message": "User is not an admin."}, status=403)
        
        admin_name = admin_user.get('name')

        event_data = {
            "eventTitle": data.get('eventTitle'),
            "eventVenue": data.get('eventVenue'),
            "eventStartTime": data.get('eventStartTime'),
            "eventEndTime": data.get('eventEndTime'),
            "eventStartDate": data.get('eventStartDate'),
            "eventEndDate": data.get('eventEndDate'),
            "eventCost": data.get('eventCost'),
            "eventDescription": data.get('eventDescription'),
            "imageBase64": data.get('imageBase64') or "",
            "createdAt": datetime.datetime.utcnow(),
            "adminId": admin_id,
            "adminName": admin_name
        }
        
        MONGODB_DB.events.insert_one(event_data)
        return JsonResponse({"status": "success", "message": "Event created successfully"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@csrf_exempt
@api_view(['GET'])
@authentication_classes([MongoJWTAuthentication])
@permission_classes([IsAuthenticated])
def my_events(request):
    try:
        admin_id = request.user.id
        events_collection = MONGODB_DB.events
        events = list(events_collection.find({"adminId": admin_id}).sort("createdAt", -1))
        for event in events:
            event["_id"] = str(event["_id"])
        return JsonResponse({"status": "success", "events": events})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

# --- Public Views ---
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
def get_event_details(request, event_id):
    if request.method == 'GET':
        try:
            events_collection = MONGODB_DB.events
            event = events_collection.find_one({"_id": ObjectId(event_id)})

            if event:
                event["_id"] = str(event["_id"])
                return JsonResponse({"status": "success", "event": event})
            else:
                return JsonResponse({"status": "error", "message": "Event not found"}, status=404)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@csrf_exempt
@api_view(['POST'])
@authentication_classes([MongoJWTAuthentication])  # Use custom authentication
@permission_classes([IsAuthenticated])
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

            start_date = dt.strptime(eventStartDate, '%Y-%m-%d').strftime('%d-%m-%Y') if eventStartDate else 'Not specified'
            end_date = dt.strptime(eventEndDate, '%Y-%m-%d').strftime('%d-%m-%Y') if eventEndDate else 'Not specified'

            genai.configure(api_key="AIzaSyBKNmM-Si0EZ7nIi4inYqIBCGO165uSIH0")  # Replace with your actual Gemini API key
            model = genai.GenerativeModel("gemini-1.5-flash")

            prompt = f"Generate a short, engaging event description for: {eventTitle} at {eventVenue}, happening from {start_date} at {eventStartTime} to {end_date} at {eventEndTime}. The event costs {eventCost} INR."

            response = model.generate_content(prompt)
            if not response.text:
                return JsonResponse({"status": "error", "message": "Empty response from AI model"}, status=500)
            description = response.text.strip()

            return JsonResponse({"status": "success", "description": description})
        except Exception as e:
            return JsonResponse({"status": "error", "message": f"Error: {str(e)}"}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

# --- Other Views ---
def home(request):
    return JsonResponse({"message": "Welcome to the Event Backend API!"})

def favicon_redirect(request):
    return JsonResponse({"status": "favicon not implemented"}, status=404)