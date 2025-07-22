import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Make sure to import Link
import axios from 'axios';

function AdminDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Make sure your backend is running and accessible at this address
      const response = await axios.get('http://127.0.0.1:8000/api/get-events/');
      if (response.data && response.data.events) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Helper function to format the date and time
  const formatEventDate = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split('-');
    const [hours, minutes] = timeStr.split(':');
    const date = new Date(year, month - 1, day, hours, minutes);
    
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
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Event Hive</h1>
          <Link to="/create-event">
            <button className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
              Create Event
            </button>
          </Link>
        </header>

        {/* Hero Section */}
        <div className="bg-indigo-600 rounded-lg shadow-lg p-8 md:p-12 mb-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-3">Discover and experience</h2>
            <p className="text-4xl md:text-5xl font-extrabold mb-4 text-indigo-200">extraordinary Events</p>
            <p className="text-indigo-200 max-w-xl mb-8">
              Enter in the world of events. Discover now the latest Events or start creating your own!
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
                Discover now
              </button>
              <button className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition duration-300">
                Watch video
              </button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-16 text-indigo-500 opacity-20">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 9l11 7 9-7-2.89-1.74L12 12.27 4.5 9zM12 14l-9-5.5V17l9 5.5 9-5.5V8.5L12 14z"/></svg>
          </div>
           <div className="absolute bottom-0 right-10 -mb-10 text-indigo-500 opacity-10">
            <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor"><path d="M20.2 5.8l-4.9-4.9c-.4-.4-.9-.6-1.4-.6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7.2c0-.5-.2-1-.8-1.4zM15 14h-4v4h-2v-4H5v-2h4V8h2v4h4v2z"/></svg>
          </div>
        </div>

        {/* Listed Events Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Listed Events</h2>
          {events.length === 0 ? (
            <div className="bg-white text-center p-12 rounded-lg shadow-md">
              <h3 className="text-xl font-medium text-gray-700">No events available.</h3>
              <p className="text-gray-500 mt-2">Check back later or create a new event!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="relative">
                    {event.imageBase64 && (
                      <img
                        src={`data:image/jpeg;base64,${event.imageBase64}`}
                        alt={event.eventTitle}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="absolute top-2 left-2 bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {event.eventCost && parseFloat(event.eventCost) > 0 ? 'PAID' : 'FREE'}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" title={event.eventTitle}>
                      {event.eventTitle}
                    </h3>
                    <p className="text-indigo-500 font-semibold text-sm mb-3">
                      {formatEventDate(event.eventStartDate, event.eventStartTime)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {event.eventVenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;