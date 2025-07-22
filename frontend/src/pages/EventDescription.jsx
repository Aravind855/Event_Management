import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Clock, ArrowLeft, Ticket, User, IndianRupee } from 'lucide-react';

// A more visually appealing loading spinner
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
    </div>
);

function EventDescription() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backLink, setBackLink] = useState('/user-dashboard');
  const { eventId } = useParams();

  useEffect(() => {
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
      const response = await axios.get(`https://event-management-m7h6.onrender.com/api/event/${eventId}/`);
      if (response.data.status === 'success') {
        setEvent(response.data.event);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to fetch event details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateStr) => {
    if (!dateStr) return "Not specified";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 p-8 text-center">{error}</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center">Event not found.</div>;

  return (
    <div className="bg-gray-100 font-sans">
      {/* --- Sticky Header --- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to={backLink} className="text-2xl font-bold text-gray-800">
            Event <span className="text-purple-600">Hive</span>
          </Link>
          <Link to={backLink} className="bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </nav>
      </header>
      
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {/* --- Main Image Banner --- */}
        <div className="w-full h-auto md:h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-8">
          <img 
            src={`data:image/jpeg;base64,${event.imageBase64}`} 
            alt={event.eventTitle}
            className="w-full h-full object-cover"
          />
        </div>

        {/* --- Event Title --- */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-2">{event.eventTitle}</h1>
          <p className="text-lg text-gray-500">An experience you won't forget.</p>
        </div>

        {/* --- Separate Detail Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-800">Date</h3>
                <p className="text-gray-600">{formatEventDate(event.eventStartDate)} - {formatEventDate(event.eventEndDate)}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-800">Venue</h3>
                <p className="text-gray-600">{event.eventVenue}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-800">Time</h3>
                <p className="text-gray-600">{event.eventStartTime} - {event.eventEndTime}</p>
            </div>
          </div>
        </div>
        
        {/* --- Two-Column Layout for Description and Booking --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left Column: Description & Organizer --- */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">About This Event</h2>
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: event.eventDescription.replace(/\n/g, '<br />') }} 
              />
            </div>
          </div>

          {/* --- Right Column: Sticky Sidebar for Booking --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Get Your Tickets</h3>
                  {event.adminName && (
                    <div className="flex items-center space-x-3 text-sm text-gray-500 mb-5">
                      <User className="h-4 w-4" />
                      <span>Hosted by <strong>{event.adminName}</strong></span>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold text-gray-700">Ticket Price</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {parseFloat(event.eventCost) > 0 ? `₹${event.eventCost}` : 'FREE'}
                    </p>
                  </div>
                  <button className="w-full flex items-center justify-center bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105">
                    <Ticket className="h-5 w-5 mr-2" />
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EventDescription;