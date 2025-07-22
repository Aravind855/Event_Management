Event Hive
Event Hive is a full-stack web application designed to create, manage, and discover events. The backend is built with Django and MongoDB, providing a robust API for event management and user authentication. The frontend is developed using React, Vite, and Tailwind CSS, offering a modern and responsive user interface. The application supports two user roles: Admin (who can create and manage events) and User (who can browse and view events). It also integrates with the Gemini API for generating engaging event descriptions.
Table of Contents

Features
Tech Stack
Project Structure
Prerequisites
Setup Instructions
Backend Setup
Frontend Setup


Running the Application
API Endpoints
Usage
Contributing
License

Features

User Authentication: Supports signup and login for both Admin and User roles using JWT-based authentication.
Event Management:
Admins can create and view their events.
Users can browse all events with filtering options (location, event type, and date).


Event Description Generation: Integrates with the Gemini API to generate engaging event descriptions.
Responsive UI: Modern and responsive frontend built with React and styled with Tailwind CSS.
MongoDB Integration: Stores user and event data in a MongoDB database.
Secure API: Uses JWT authentication for protected endpoints and CORS for secure frontend-backend communication.
Carousel and Filters: Interactive carousel for event promotion and dynamic filters for event discovery.

Tech Stack

Backend:
Django 5.2.4
Django REST Framework
MongoDB (via PyMongo)
Simple JWT for authentication
Python 3.8+


Frontend:
React 18
Vite (build tool)
Tailwind CSS
Axios for API requests
Framer Motion for animations
Lucide React for icons


External Services:
Gemini API for event description generation
MongoDB Atlas (or local MongoDB instance) for database



Project Structure
event-hive/
├── backend/
│   ├── backend/
│   │   ├── settings.py          # Django settings with MongoDB and JWT configuration
│   │   ├── urls.py             # Main URL routing
│   │   └── wsgi.py             # WSGI configuration
│   ├── event/
│   │   ├── views.py            # API views for user auth, event management, and description generation
│   │   ├── authentication.py    # Custom MongoJWTAuthentication class
│   │   └── urls.py             # App-specific URL routing
│   └── manage.py               # Django management script
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx  # Admin dashboard for event management
│   │   │   ├── UserDashboard.jsx   # User dashboard for event browsing
│   │   │   ├── Login.jsx          # Login page for users and admins
│   │   │   ├── UserSignup.jsx     # User signup page
│   │   │   ├── CreateEvent.jsx    # Event creation page for admins
│   │   │   ├── EventDescription.jsx # Event details page
│   │   │   └── Home.jsx           # Landing page
│   │   ├── assets/                # Images and static assets
│   │   └── App.jsx                # Main React app with routing
│   ├── package.json               # Frontend dependencies and scripts
│   ├── vite.config.js             # Vite configuration
│   └── tailwind.config.js         # Tailwind CSS configuration
├── .env                           # Environment variables (not included in repo)
└── README.md                      # Project documentation

Prerequisites
Before setting up the project, ensure you have the following installed:

Node.js (v16 or higher)
Python (v3.8 or higher)
MongoDB (local instance or MongoDB Atlas account)
Git (for cloning the repository)
npm or yarn (for frontend package management)
pip (for Python package management)

Additionally, you need:

A MongoDB URI for database connection (local or Atlas).
A Gemini API key for event description generation.

Setup Instructions
Backend Setup

Clone the Repository:
git clone <repository-url>
cd event-hive/backend


Create a Virtual Environment:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


Install Dependencies:
pip install django djangorestframework django-cors-headers pymongo python-dotenv rest_framework_simplejwt


Set Up Environment Variables:Create a .env file in the backend directory with the following:
MONGODB_URI=mongodb://localhost:27017/event_db  # Replace with your MongoDB URI
GEMINI_API_KEY=your-gemini-api-key             # Replace with your Gemini API key


Apply Migrations:
python manage.py migrate


Test the Backend Setup:
python manage.py runserver

The backend should be running at http://127.0.0.1:8000.


Frontend Setup

Navigate to the Frontend Directory:
cd ../frontend


Install Dependencies:
npm install

or
yarn install


Set Up Tailwind CSS:Ensure tailwind.config.js is configured correctly. The default configuration should work as provided.

Test the Frontend Setup:
npm run dev

or
yarn dev

The frontend should be running at http://localhost:5173.


Running the Application

Start the Backend:In the backend directory, run:
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver


Start the Frontend:In the frontend directory, run:
npm run dev

or
yarn dev


Access the Application:

Open http://localhost:5173 in your browser.
Use /signup to create a user or admin account.
Use /login?role=user or /login?role=admin to log in.
Admins are redirected to /admin-dashboard for event management.
Users are redirected to /user-dashboard for event browsing.



API Endpoints
The backend provides the following API endpoints:

POST /api/user-signup/: Register a new user.
POST /api/admin-signup/: Register a new admin.
POST /api/user-login/: Authenticate a user and return JWT tokens.
POST /api/admin-login/: Authenticate an admin and return JWT tokens.
POST /api/create-event/: Create a new event (admin only, requires JWT).
GET /api/my-events/: Fetch events created by the logged-in admin (requires JWT).
GET /api/get-events/: Fetch all events (public).
GET /api/get-event-details//: Fetch details of a specific event (public).
POST /api/generate-event-description/: Generate an event description using the Gemini API (requires JWT).
GET /: Welcome message for the API.
GET /favicon.ico/: Favicon placeholder (returns 404).

Usage

Signup/Login:

Register as a user or admin via the signup page (/signup).
Log in using the appropriate role (/login?role=user or /login?role=admin).
Upon successful login, JWT tokens are stored in localStorage.


Admin Dashboard:

Admins can create events via /create-event.
View all created events in /admin-dashboard.
Events include details like title, venue, date, time, cost, and description.


User Dashboard:

Users can browse events with filters for location, event type, and date.
View event details by clicking on an event card (/event/<event_id>).
A carousel displays promotional images, and a "Load More" button paginates events.


Event Description Generation:

Admins can generate event descriptions using the Gemini API when creating events.
The description is based on event details like title, venue, dates, and cost.



Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Create a pull request.

Please ensure your code follows the project's coding style and includes appropriate tests.
License
This project is licensed under the MIT License. See the LICENSE file for details.