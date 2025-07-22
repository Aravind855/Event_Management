import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import UserSignup from './pages/UserSignup';
import AdminDashboard from './pages/AdminDashboard';
import CreateEvent from './pages/CreateEvent';
import UserDashboard from './pages/UserDashboard'; // Import the new dashboard

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/user-dashboard" element={<UserDashboard />} /> {/* Add this new route */}
      </Routes>
    </Router>
  );
}

export default App;