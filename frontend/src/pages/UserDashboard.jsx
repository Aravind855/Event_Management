import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// --- Helper Icons ---
const SearchIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);

const FooterLink = ({ href, children }) => (
    <a href={href} className="text-gray-400 hover:text-white transition-colors">{children}</a>
);

const SocialIcon = ({ href, children }) => (
    <a href={href} className="text-gray-400 hover:text-white transition-colors">{children}</a>
);


function UserDashboard() {
  const [events, setEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState(6);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/get-events/');
      if (response.data && response.data.events) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const loadMoreEvents = () => {
    setVisibleEvents(prev => prev + 3);
  };
  
  const formatEventDate = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "Date & Time not specified";
    const [year, month, day] = dateStr.split('-');
    const [hours, minutes] = timeStr.split(':');
    const date = new Date(year, month - 1, day, hours, minutes);
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div className="bg-white font-sans">
        {/* Header and Hero Section */}
        <div className="relative bg-gray-900">
             <div className="absolute inset-0">
                <img
                    className="w-full h-full object-cover opacity-40"
                    src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"
                    alt="Concert background"
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
                {/* Header */}
                <header className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Event <span className="text-purple-400">Hive</span></h1>
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-white font-semibold hover:text-purple-300 transition-colors">Login</Link>
                        <Link to="/signup" className="bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-purple-700 transition-colors">
                            Signup
                        </Link>
                    </div>
                </header>

                {/* Hero Text */}
                <div className="text-center pt-24 pb-16">
                    <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
                        MADE FOR THOSE
                    </h2>
                    <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
                        WHO DO
                    </h2>
                </div>

                {/* Search Bar */}
                <div className="bg-indigo-700 bg-opacity-80 backdrop-blur-sm p-4 rounded-lg shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="md:col-span-1">
                            <label className="text-white text-sm font-semibold mb-1 block">Looking for</label>
                            <select className="w-full p-3 bg-indigo-500 text-white rounded-md border-0 focus:ring-2 focus:ring-purple-400">
                                <option>Choose event type</option>
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-white text-sm font-semibold mb-1 block">Location</label>
                            <select className="w-full p-3 bg-indigo-500 text-white rounded-md border-0 focus:ring-2 focus:ring-purple-400">
                                <option>Choose location</option>
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-white text-sm font-semibold mb-1 block">When</label>
                            <select className="w-full p-3 bg-indigo-500 text-white rounded-md border-0 focus:ring-2 focus:ring-purple-400">
                                <option>Choose date and time</option>
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <button className="w-full bg-purple-600 p-3 rounded-md flex justify-center items-center hover:bg-purple-700 transition-colors shadow-lg">
                               <SearchIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Upcoming Events Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Upcoming <span className="text-purple-600">Events</span></h2>
                <div className="flex space-x-2">
                    {/* Filter dropdowns can be implemented here */}
                </div>
            </div>

            {events.length === 0 ? (
                <p className="text-center text-gray-500">No upcoming events found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.slice(0, visibleEvents).map(event => (
                        <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                             <div className="relative">
                                {event.imageBase64 && (
                                    <img src={`data:image/jpeg;base64,${event.imageBase64}`} alt={event.eventTitle} className="w-full h-48 object-cover"/>
                                )}
                                <span className="absolute top-3 left-3 bg-white text-purple-600 text-xs font-bold px-2 py-1 rounded-full shadow-md">
                                    {event.eventCost && parseFloat(event.eventCost) > 0 ? 'PAID' : 'FREE'}
                                </span>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{event.eventTitle}</h3>
                                <p className="text-sm text-purple-600 font-semibold mb-3">{formatEventDate(event.eventStartDate, event.eventStartTime)}</p>
                                <p className="text-sm text-gray-600 mb-4">{event.eventVenue}</p>
                                <button className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {visibleEvents < events.length && (
                 <div className="text-center mt-12">
                    <button onClick={loadMoreEvents} className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-transform transform hover:scale-105">
                        Load more...
                    </button>
                </div>
            )}
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold mb-4">Event <span className="text-purple-400">Hive</span></h2>
                        <form className="flex">
                            <input type="email" placeholder="Enter your mail" className="w-full p-2 rounded-l-md text-gray-800 border-0 focus:ring-2 focus:ring-purple-400" />
                            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition-colors">Subscribe</button>
                        </form>
                    </div>
                     <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-bold mb-3">Links</h3>
                            <ul className="space-y-2">
                                <li><FooterLink href="#">Home</FooterLink></li>
                                <li><FooterLink href="#">About</FooterLink></li>
                                <li><FooterLink href="#">Services</FooterLink></li>
                                <li><FooterLink href="#">Get in touch</FooterLink></li>
                                <li><FooterLink href="#">FAQs</FooterLink></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 flex justify-between items-center">
                    <p className="text-gray-400 text-sm">© 2024 Event Hive. All rights reserved.</p>
                    <div className="flex space-x-4">
                       {/* Social icons here */}
                    </div>
                </div>
            </div>
        </footer>
    </div>
  );
}

export default UserDashboard;