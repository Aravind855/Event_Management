from django.urls import path
from .views import *

urlpatterns = [
    path('api/user-signup/', user_signup, name='user_signup'),
    path('api/admin-signup/', admin_signup, name='admin_signup'),
    path('api/user-login/', user_login, name='user_login'),
    path('api/admin-login/', admin_login, name='admin_login'),
    path('api/create-event/', create_event, name='create_event'),
    path('api/get-events/', get_events, name='get_events'),
    path('api/generate-event-description/', generate_event_description, name='generate_event_description'),
    path('api/event/<str:event_id>/', get_event_details, name='get_event_details'),
    path('api/my-events/', my_events, name='my_events'),

]