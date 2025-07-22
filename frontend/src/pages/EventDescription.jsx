import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Clock } from 'lucide-react';

function EventDescription() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backLink, setBackLink] = useState('/user-dashboard'); // Default back link
  const { eventId } = useParams();

  useEffect(() => {
    // Check if the user is an admin to set the correct back link
    const adminName = localStorage.getItem('admin_name');
    if (adminName) {
      setBackLink('/admin-dashboard');
    }

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      // This is a public endpoint, so no token is needed
      const response = await axios.get(`http://127.0.0.1:8000/api/event/${eventId}/`);
      if (response.data.status === 'success') {
        setEvent(response.data.event);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to fetch event details. Please try again later.');
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const formatEventDate = (dateStr) => {
    if (!dateStr) return "Not specified";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Event not found.</div>;
  }

  return (
    <div className="bg-gray-50 font-sans">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to={backLink} className="text-2xl font-bold text-gray-800">
            Event <span className="text-purple-600">Hive</span>
          </Link>
          <Link to={backLink} className="text-purple-600 hover:text-purple-800 font-semibold">
            ← Back to Events
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="w-full h-96 rounded-lg overflow-hidden shadow-2xl mb-8">
          <img 
            src={`data:image/jpeg;base64,${event.imageBase64}`} 
            alt={event.eventTitle}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">{event.eventTitle}</h1>
          <p className="text-lg text-gray-600">An experience you won't forget.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Calendar className="mx-auto h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-800">Date</h3>
            <p className="text-gray-600">{formatEventDate(event.eventStartDate)} - {formatEventDate(event.eventEndDate)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <MapPin className="mx-auto h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-800">Venue</h3>
            <p className="text-gray-600">{event.eventVenue}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Clock className="mx-auto h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-800">Time</h3>
            <p className="text-gray-600">{event.eventStartTime} - {event.eventEndTime}</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">About The Event</h2>
          <div 
            className="prose max-w-none text-gray-700 leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: event.eventDescription.replace(/\n/g, '<br />') }} 
          />
        </div>
        
        <div className="text-center mt-12">
            <button className="bg-purple-600 text-white font-bold py-3 px-10 rounded-lg shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105">
                Book Your Ticket - ₹{event.eventCost}
            </button>
        </div>
      </main>
    </div>
  );
}

export default EventDescription;