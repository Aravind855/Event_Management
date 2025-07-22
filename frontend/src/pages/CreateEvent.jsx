import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Upload Icon Component for the image upload area
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
  const [imageBase64, setImageBase64] = useState(null); // For backend
  const [imagePreview, setImagePreview] = useState(null); // For UI preview
  const [eventDescription, setEventDescription] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set preview for the UI
        setImagePreview(reader.result); 
        // Set base64 string for the backend (without prefix)
        setImageBase64(reader.result.split(',')[1]); 
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDescription = async () => {
    if (!eventTitle) {
      setMessage('Please enter an event title first to generate a description.');
      return;
    }
    setMessage('Generating AI description...');
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://127.0.0.1:8000/api/generate-event-description/', {
        eventTitle,
        eventVenue,
        eventStartTime,
        eventEndTime,
        eventStartDate,
        eventEndDate,
        eventCost,
      });
      setEventDescription(response.data.description);
      setMessage('Description generated successfully!');
    } catch (error) {
      setMessage('Error generating description: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Creating event...');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/create-event/', {
        eventTitle,
        eventVenue,
        eventStartTime,
        eventEndTime,
        eventStartDate,
        eventEndDate,
        eventCost,
        eventDescription,
        imageBase64,
      });
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
        <header className="mb-12 ">
          <Link to="/admin-dashboard" className="text-3xl mr-130 font-bold text-gray-800 hover:text-indigo-600 transition-colors">
            Event <span className="text-indigo-600">Hive</span>
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          {/* --- Create Event Section --- */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-black-900 mb-10">Create Event</h2>
            <div className="space-y-6">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-black-600 mb-1">Event Title</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter event title"
                  required
                />
              </div>

              {/* Event Venue */}
              <div>
                <label className="block text-sm font-medium text-black-600 mb-1">Event Venue</label>
                <input
                  type="text"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter venue address"
                />
              </div>

              {/* Times */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-black-600 mb-1">Start time</label>
                  <input
                    type="time"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-black-600 mb-1">End time</label>
                  <input
                    type="time"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Dates */}
               <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-black-600 mb-1">Start date</label>
                  <input
                    type="date"
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-black-600 mb-1">End date</label>
                  <input
                    type="date"
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Event Cost */}
              <div>
                <label className="block text-sm font-medium text-black-600 mb-1">Event Cost</label>
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

          {/* --- Event Description Section --- */}
          <div>
            <h2 className="text-3xl font-bold text-center text-black-900 mb-10">Event Description</h2>
            <div className="space-y-6">
               {/* Event Image */}
              <div>
                <label className="block text-s font-medium text-black-600 mb-1">Event Image</label>
                <label htmlFor="file-upload" className="flex items-center justify-center w-full h-56 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Event preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <UploadIcon />
                      <p className="mt-2 text-sm font-semibold text-gray-600">Upload Here</p>
                    </div>
                  )}
                  <input id="file-upload" name="file-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>

               {/* Event Description */}
               <div>
                <div className="flex items-center justify-between mb-2">
                <label className="block text-s font-medium text-black-600 mb-1">Event Description</label>
                <button
                  type="button"
                  onClick={generateDescription}
                  className="mt-3 mb-3 ml-120 px-4 py-2 bg-purple-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
                >
                  Generate AI Description
                </button>
                </div>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg h-30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type here..."
                />
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
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
          <p className={`mt-6 text-center font-medium ${message.includes('success') ? 'text-green-600' : message.includes('Error') ? 'text-red-600' : 'text-gray-600'}`}>
            {message}
          </p>
        )}
       </div>
    </div>
  );
}

export default CreateEvent;