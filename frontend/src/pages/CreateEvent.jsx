import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Upload Icon Component
const UploadIcon = () => (
  <svg
    className="w-10 h-10 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);

function CreateEvent() {
  const [eventTitle, setEventTitle] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventCost, setEventCost] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [eventDescription, setEventDescription] = useState('');
  const [message, setMessage] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]; // 2025-07-22

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageBase64(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateDates = () => {
    let isValid = true;

    // Validate start date (must be today or later)
    if (eventStartDate && eventStartDate < today) {
      setStartDateError('Start date cannot be before today.');
      isValid = false;
    } else {
      setStartDateError('');
    }

    // Validate end date (must not be before start date)
    if (eventStartDate && eventEndDate && eventEndDate < eventStartDate) {
      setEndDateError('End date cannot be before start date.');
      isValid = false;
    } else {
      setEndDateError('');
    }

    return isValid;
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setEventStartDate(value);
    // Clear end date error if start date changes
    if (eventEndDate && value > eventEndDate) {
      setEndDateError('End date cannot be before start date.');
    } else {
      setEndDateError('');
    }
    // Validate start date
    if (value < today) {
      setStartDateError('Start date cannot be before today.');
    } else {
      setStartDateError('');
    }
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setEventEndDate(value);
    // Validate end date
    if (eventStartDate && value < eventStartDate) {
      setEndDateError('End date cannot be before start date.');
    } else {
      setEndDateError('');
    }
  };

  const generateDescription = async () => {
    if (!eventTitle) {
      setMessage('Please enter an event title first to generate a description.');
      return;
    }
    setMessage('Generating AI description...');
    const token = localStorage.getItem('access_token');
    if (!token) {
      setMessage('Authentication error. Please log in again.');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/generate-event-description/',
        {
          eventTitle,
          eventVenue,
          eventStartTime,
          eventEndTime,
          eventStartDate,
          eventEndDate,
          eventCost,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setEventDescription(response.data.description);
      setMessage('Description generated successfully!');
    } catch (error) {
      console.error('Error details:', error);
      setMessage('Error generating description: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDates()) {
      setMessage('Please fix the date errors before submitting.');
      return;
    }
    setMessage('Creating event...');
    const token = localStorage.getItem('access_token');
    if (!token) {
      setMessage('Authentication error. Please log in again.');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/create-event/',
        {
          eventTitle,
          eventVenue,
          eventStartTime,
          eventEndTime,
          eventStartDate,
          eventEndDate,
          eventCost,
          eventDescription,
          imageBase64,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message || 'Event created successfully!');
      if (response.data.status === 'success') {
        setTimeout(() => navigate('/admin-dashboard'), 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred while creating the event.');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="border-t-4 border-indigo-600"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-12">
          <Link
            to="/admin-dashboard"
            className="text-3xl font-bold text-gray-800 hover:text-indigo-600 transition-colors"
          >
            Event <span className="text-indigo-600">Hive</span>
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Create Event</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter event title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Venue</label>
                <input
                  type="text"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter venue address"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start time</label>
                  <input
                    type="time"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">End time</label>
                  <input
                    type="time"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
                  <input
                    type="date"
                    value={eventStartDate}
                    onChange={handleStartDateChange}
                    min={today}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {startDateError && (
                    <p className="text-red-600 text-sm mt-1">{startDateError}</p>
                  )}
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
                  <input
                    type="date"
                    value={eventEndDate}
                    onChange={handleEndDateChange}
                    min={eventStartDate || today}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {endDateError && (
                    <p className="text-red-600 text-sm mt-1">{endDateError}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Cost</label>
                <input
                  type="number"
                  value={eventCost}
                  onChange={(e) => setEventCost(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter the cost of the event in INR"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Event Description</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full h-56 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 overflow-hidden"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Event preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <UploadIcon />
                      <p className="mt-2 text-sm font-semibold text-gray-600">Upload Here</p>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Event Description</label>
                  <button
                    type="button"
                    onClick={generateDescription}
                    className="px-4 py-2 bg-purple-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
                  >
                    Generate AI Description
                  </button>
                </div>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type here..."
                />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              type="submit"
              className="w-full max-w-xs px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            >
              Create event
            </button>
          </div>
        </form>

        {message && (
          <p
            className={`mt-6 text-center font-medium ${
              message.includes('success') ? 'text-green-600' : message.includes('Error') ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default CreateEvent;