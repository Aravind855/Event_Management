# authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from bson.objectid import ObjectId
from backend.settings import MONGODB_DB

class MongoJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token['user_id']  # Extract user_id from token
            # Query MongoDB users collection
            user_data = MONGODB_DB.users.find_one({"_id": ObjectId(user_id)})
            if not user_data:
                raise InvalidToken("User not found")

            # Create a temporary user object for Django's authentication
            user = type('User', (), {
                'id': str(user_data['_id']),
                'pk': str(user_data['_id']),
                'is_authenticated': True,
                'email': user_data.get('email'),
                'role': user_data.get('role'),
                'name': user_data.get('name')
            })()
            return user
        except Exception as e:
            raise InvalidToken(f"Token invalid: {str(e)}")