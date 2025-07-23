# 🎉 Event Hive

**Event Hive** is a full-stack web application that allows users to create, manage, and discover events. It features an Admin/User system with secure authentication, integration with the Gemini API for automatic event description generation, and a sleek React-based frontend.

---

## 📑 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Features

- **User Authentication**  
  Signup/login for Admin and User roles with JWT-based authentication.

- **Event Management**  
  - Admins can create and view events.
  - Users can browse events with filters (location, type, date).

- **AI-Powered Event Descriptions**  
  Gemini API integration to generate engaging event descriptions.

- **Responsive Frontend**  
  Built with React, Tailwind CSS, and Vite for modern UI and performance.

- **MongoDB Integration**  
  Uses MongoDB for storing user and event data.

- **Secure API**  
  JWT for secure access, with CORS configuration for frontend-backend communication.

- **Interactive UX**  
  Carousel, filters, and animations for dynamic user experience.

---

## 🛠️ Tech Stack

### Backend
- Django 5.2.4
- Django REST Framework
- MongoDB (via PyMongo)
- Simple JWT
- Python 3.8+

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- Framer Motion
- Lucide React

### External Services
- Gemini API (for AI descriptions)
- MongoDB Atlas (or local MongoDB instance)

---

## 📁 Project Structure

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


---

## 📦 Prerequisites

Ensure the following are installed:

- Node.js (v16+)
- Python (v3.8+)
- MongoDB (local or Atlas)
- Git
- npm or yarn
- pip

Also required:

- MongoDB URI
- Gemini API Key

---

## ⚙️ Setup Instructions

### 🔧 Backend Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd event-hive/backend

2. **Create Virtual Environment**

    ```bash
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate

3. **Install Dependencies**

    ```bash
    pip install django djangorestframework django-cors-headers pymongo python-dotenv rest_framework_simplejwt

4. **Set Environment Variables**

Create a .env file:
    ```bash
    MONGODB_URI=mongodb://localhost:27017/event_db
    GEMINI_API_KEY=your-gemini-api-key

Run Migrations
    ```bash
    python manage.py migrate
    Start Backend
    ```bash
    python manage.py runserver
    Access: http://127.0.0.1:8000

## Frontend Setup

Navigate to Frontend Directory
    ```bash
    cd ../frontend
    Install Dependencies
    ```bash
    npm install
    npm run dev
    Access: http://localhost:5173

Here is the **complete markdown-formatted content** for the remaining sections of your Event Hive project README, including **Running the Application**, **API Endpoints**, **Usage**, **Contributing**, and **License**:

````markdown
## ▶️ Running the Application

### Start Backend
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
````

### Start Frontend

```bash
cd frontend
npm run dev
```

Visit the application at: [http://localhost:5173](http://localhost:5173)

---

## 🔗 API Endpoints

| Method | Endpoint                           | Description                                 |
| ------ | ---------------------------------- | ------------------------------------------- |
| POST   | `/api/user-signup/`                | Register a new user                         |
| POST   | `/api/admin-signup/`               | Register a new admin                        |
| POST   | `/api/user-login/`                 | User login with JWT                         |
| POST   | `/api/admin-login/`                | Admin login with JWT                        |
| POST   | `/api/create-event/`               | Create a new event (Admin only)             |
| GET    | `/api/my-events/`                  | Get events created by logged-in admin       |
| GET    | `/api/get-events/`                 | Get all events                              |
| GET    | `/api/get-event-details/<id>/`     | Get specific event details                  |
| POST   | `/api/generate-event-description/` | Generate event description using Gemini API |
| GET    | `/`                                | API Welcome message                         |
| GET    | `/favicon.ico/`                    | Favicon placeholder                         |

---

## 👨‍💻 Usage

### Signup / Login

* Visit `/signup` to register as a User or Admin.
* Login via:

  * `/login?role=user` for user login.
  * `/login?role=admin` for admin login.
* After login, JWT tokens are stored in `localStorage`.

### Admin Dashboard

* Create events using `/create-event`
* Manage and view all created events via `/admin-dashboard`

### User Dashboard

* Explore events at `/user-dashboard`
* View specific event details at `/event/<event_id>`
* Use filters (location, type, date) and carousel for discovery

### Gemini Description Generation

* When creating events, Admins can generate event descriptions using the Gemini API automatically.

---

## 🤝 Contributing

We welcome contributions! Follow these steps to contribute:

1. **Fork the repository**

2. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make your changes and commit**

   ```bash
   git commit -m "Add your feature"
   ```

4. **Push to the branch**

   ```bash
   git push origin feature/your-feature
   ```

5. **Create a Pull Request**

Please make sure your code follows the project’s coding standards and includes appropriate tests if applicable.

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for full license information.

