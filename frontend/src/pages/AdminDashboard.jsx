import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// --- STEP 1: Import your background image ---
import event_img from '../assets/products.png'; // Make sure the path is correct

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // Use navigate for logout

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://event-management-m7h6.onrender.com/api/get-events/');
      if (response.data && response.data.events) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all auth data
    navigate('/');
  };

  const formatEventDate = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "Date not specified";
    const date = new Date(`${dateStr}T${timeStr}`);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Event <span className="text-purple-600">Hive</span>
          </h1>
          <div className="flex items-center space-x-4">
            <Link to="/create-event">
              <button className="bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
                Create Event
              </button>
            </Link>
            <button onClick={handleLogout} className="bg-gray-200 text-gray-800 font-semibold px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                Logout
            </button>
          </div>
        </header>

        {/* --- MODIFIED Hero Section with Background Image --- */}
        <div 
          className="rounded-xl shadow-lg p-8 md:p-12 mb-12 text-white relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${event_img})` }}
        >
            {/* This overlay adds a dark tint to make the text readable */}
            <div className="absolute inset-0 bg-blue-900/70 z-0"></div>

            {/* All content is placed in a relative container with a higher z-index */}
            <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-2">Discover and experience</h2>
                <p className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-200">extraordinary Events</p>
                <p className="text-blue-100 max-w-xl mb-8">
                Enter in the world of events. Discover now the latest Events or start creating your own!
                </p>
                <div className="flex space-x-4">
                <button className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-2xl shadow-md hover:bg-gray-100 transition duration-300">
                    Discover now
                </button>
                <button className=" text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white hover:text-purple-600 transition duration-300">
                    Watch video
                </button>
                </div>
            </div>
        </div>

        {/* --- Listed Events Section --- */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Listed Events</h2>
          {events.length === 0 ? (
            <div className="bg-white text-center p-12 rounded-lg shadow-md">
              <h3 className="text-xl font-medium text-gray-700">No events available.</h3>
              <p className="text-gray-500 mt-2">Click "Create Event" to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link to={`/event/${event._id}`} key={event._id} className="block group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                    <div className="relative">
                        <img
                        src={`data:image/jpeg;base64,${event.imageBase64}`}
                        alt={event.eventTitle}
                        className="w-full h-48 object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-md shadow-sm">
                            {parseFloat(event.eventCost) > 0 ? "PAID" : "FREE"}
                        </span>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                        <h3 className="font-bold text-gray-800 mb-2 leading-tight">
                            {event.eventTitle}
                        </h3>
                        <p className="text-purple-600 font-medium mb-3 text-sm">
                            {formatEventDate(event.eventStartDate, event.eventStartTime)}
                        </p>
                        <p className="text-gray-500 text-xs uppercase tracking-wide mt-auto">
                            {event.eventVenue}
                        </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;