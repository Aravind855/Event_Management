import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Linkedin, Instagram, Facebook, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Reusable FooterLink Component ---
const FooterLink = ({ href, children }) => (
  <a href={href} className="text-gray-200 hover:text-white transition-colors text-sm">{children}</a>
);

// --- Reusable SocialIcon Component ---
const SocialIcon = ({ href, children }) => (
  <a href={href} className="text-white border border-gray-400 rounded p-2 hover:bg-white hover:text-indigo-800 transition-colors">
    {children}
  </a>
);

function UserDashboard() {
  const [events, setEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState(6);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // State for Filters
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Carousel Images with Fallback
  const carouselImages = [
    {
      src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
      fallback: 'https://picsum.photos/2070/500?random=1',
    },
    {
      src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2070&auto=format&fit=crop',
      fallback: 'https://picsum.photos/2070/500?random=2',
    },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/get-events/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (response.data && response.data.events) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('admin_name');
    navigate('/');
  };

  const loadMoreEvents = () => {
    setVisibleEvents((prev) => prev + 3);
  };

  const formatEventDate = (dateStr) => {
    if (!dateStr) return 'Date not specified';
    const date = new Date(dateStr);
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(date).replace(' at', ',');
  };

  // Carousel Navigation
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  // Image Error Handling
  const handleImageError = (e, fallbackSrc) => {
    e.target.src = fallbackSrc;
  };

  // Filtering Logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const locationMatch = locationFilter ? event.eventVenue === locationFilter : true;
      const typeMatch = typeFilter ? event.eventTitle.toLowerCase().includes(typeFilter.toLowerCase()) : true;
      const dateMatch = dateFilter ? checkDateFilter(event.eventStartDate, dateFilter) : true;
      return locationMatch && typeMatch && dateMatch;
    });
  }, [events, locationFilter, typeFilter, dateFilter]);

  const checkDateFilter = (eventDate, filter) => {
    const today = new Date();
    const event = new Date(eventDate);
    if (filter === 'today') {
      return event.toDateString() === today.toDateString();
    } else if (filter === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return event.toDateString() === tomorrow.toDateString();
    } else if (filter === 'weekend') {
      return event.getDay() === 0 || event.getDay() === 6;
    } else if (filter === 'week') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return event >= weekStart && event <= weekEnd;
    }
    return true;
  };

  // Dynamic Filter Options
  const locationOptions = useMemo(() => [...new Set(events.map((e) => e.eventVenue))], [events]);
  const typeOptions = useMemo(() => [...new Set(events.map((e) => e.eventTitle.split(' ')[0].replace(/,/g, '')))], [events]);

  return (
    <div className="bg-white font-sans min-h-screen">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Event <span className="text-purple-600">Hive</span>
          </h1>
          <button onClick={handleLogout} className="bg-purple-600 text-white font-medium px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm">
            Logout
          </button>
        </div>
      </header>

      {/* Hero Section with Carousel */}
      <div className="relative bg-gray-900 h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src={carouselImages[currentImageIndex].src}
            alt="Event background"
            onError={(e) => handleImageError(e, carouselImages[currentImageIndex].fallback)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          {/* Carousel Controls */}
          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
            MADE FOR THOSE
          </h2>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
            WHO DO
          </h2>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-5xl mx-auto -mt-20 z-10 px-4">
        <div className="bg-indigo-700 p-6 rounded-lg shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Looking for</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full p-3 bg-white text-gray-700 rounded-md border-0 focus:ring-2 focus:ring-purple-400 text-sm"
              >
                <option value="">Choose event type</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full p-3 bg-white text-gray-700 rounded-md border-0 focus:ring-2 focus:ring-purple-400 text-sm"
              >
                <option value="">Choose location</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white text-sm font-medium mb-2 block">When</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-3 bg-white text-gray-700 rounded-md border-0 focus:ring-2 focus:ring-purple-400 text-sm"
              >
                <option value="">Choose date and time</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="weekend">This Weekend</option>
                <option value="week">This Week</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => {}} // Filters are already applied via state
                className="w-full bg-purple-600 p-3 rounded-md flex justify-center items-center hover:bg-purple-700 transition-colors shadow-lg"
              >
                <Search className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Upcoming <span className="text-purple-600">Events</span>
          </h2>
          <div className="flex space-x-3">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Location</option>
              {locationOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Category</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.slice(0, visibleEvents).map((event) => (
              <Link to={`/event/${event._id}`} key={event._id} className="block group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={event.imageBase64 ? `data:image/jpeg;base64,${event.imageBase64}` : 'https://picsum.photos/300/200?random=1'}
                      alt={event.eventTitle}
                      className="w-full h-48 object-cover"
                      onError={(e) => (e.target.src = 'https://picsum.photos/300/200?random=1')}
                    />
                    <span className="absolute top-3 left-3 bg-white text-violet-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
                      {parseFloat(event.eventCost) > 0 ? 'PAID' : 'FREE'}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight line-clamp-2">
                      {event.eventTitle}
                    </h3>
                    <p className="text-purple-600 font-medium mb-2 text-sm">{formatEventDate(event.eventStartDate)}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">{event.eventVenue}</p>
                      <button className="bg-purple-600 text-white text-sm font-medium py-1 px-3 rounded hover:bg-purple-700 transition-colors">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {visibleEvents < filteredEvents.length && (
          <div className="text-center mt-12">
            <button
              onClick={loadMoreEvents}
              className="bg-purple-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Load more...
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Event <span className="text-purple-400">Hive</span>
            </h2>
            <div className="flex justify-center max-w-md mx-auto mb-8">
              <input
                type="email"
                placeholder="Enter your mail"
                className="bg-white flex-1 px-4 py-3 text-gray-900 rounded-lg border-1 text-sm"
              />
              <button
                type="submit"
                className="bg-purple-600 ml-3 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
              >
                Subscribe
              </button>
            </div>
            <nav className="flex justify-center space-x-6 mb-8">
              <FooterLink href="#">Home</FooterLink>
              <FooterLink href="#">About</FooterLink>
              <FooterLink href="#">Services</FooterLink>
              <FooterLink href="#">Get in touch</FooterLink>
              <FooterLink href="#">FAQs</FooterLink>
            </nav>
          </div>
          <div className="mt-8 pt-8 border-t border-white-700 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-4">
              <button className="bg-purple-600 text-white text-xs font-semibold px-4 py-1 rounded">English</button>
              <a href="#" className="text-gray-300 hover:text-white text-xs">French</a>
              <a href="#" className="text-gray-300 hover:text-white text-xs">Hindi</a>
            </div>
            <div className="flex space-x-4 ml-35">
              <SocialIcon href="#"><Linkedin size={20} /></SocialIcon>
              <SocialIcon href="#"><Instagram size={20} /></SocialIcon>
              <SocialIcon href="#"><Facebook size={20} /></SocialIcon>
            </div>
            <p className="text-white text-sm">Non Copyrighted ® 2023 Upload by EventHive</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UserDashboard;