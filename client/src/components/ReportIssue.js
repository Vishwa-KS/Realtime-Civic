import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WebcamCapture from './WebcamCapture';

function ReportIssue() {
  const [issue, setIssue] = useState('');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [file, setFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Function to get the user's current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Call reverse geocoding function after getting location
          const fetchedAddress = await getAddressFromCoordinates(latitude, longitude);
          setAddress(fetchedAddress);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Function to convert latitude and longitude to a human-readable address using Google Maps Geocoding API
  const getAddressFromCoordinates = async (latitude, longitude) => {
    const API_KEY = 'AIzaSyDGdHO2SKi7FWgJ1CMaSbo2L7vjGLXep4c'; // Replace with your actual Google API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK') {
        const address = response.data.results[0].formatted_address;
        return address;
      } else {
        throw new Error('Failed to get address.');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Address not found';
    }
  };

  // Handle file input change (if the user selects a file)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Handle captured image from WebcamCapture component
  const handleCapture = (imageData) => {
    setCapturedImage(imageData);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issue || !location) {
      alert('Please provide an issue description and allow location access.');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser._id) {
      alert('User not logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('issueDescription', issue);
    formData.append('location', JSON.stringify(location));
    formData.append('userId', storedUser._id); // Add userId to formData
    formData.append('image', file); // If an image is uploaded
    if (capturedImage) {
      formData.append('imageUrl', capturedImage); // If camera image is captured
    }

    try {
      setLoading(true);
      setSuccessMessage('');
      setErrorMessage('');
      const response = await axios.post('http://localhost:5000/api/report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      setSuccessMessage('Report submitted successfully!');
      setIssue('');
      setLocation(null);
      setFile(null);
      setCapturedImage(null);
      console.log('Report submitted:', response.data);

      // Redirect to dashboard after successful report submission with new report data
      navigate('/dashboard', { state: { newReport: response.data.issue } }); // send the issue object

    } catch (error) {
      setLoading(false);
      setErrorMessage('Error submitting report. Please try again.');
      if (error.response) {
        console.error('Error submitting report:', error.response.data);
      } else {
        console.error('Error submitting report:', error.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg max-w-md">
      <h2 className="text-center text-2xl font-semibold mb-6">Report an Issue</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Describe the issue..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          required
          rows={4}
        />
        <div className="mb-4">
          <button
            type="button"
            onClick={getLocation}
            className="btn btn-primary w-full mb-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Get Location
          </button>
          {location && (
            <p className="text-sm text-gray-600">
              Location: Latitude {location.latitude.toFixed(6)}, Longitude {location.longitude.toFixed(6)}
            </p>
          )}
          {address && (
            <p className="text-sm text-gray-600">
              Address: {address}
            </p>
          )}
        </div>

        {/* Webcam Capture Section */}
        <div className="mb-4">
          <WebcamCapture onCapture={handleCapture} />
          {capturedImage && (
            <div className="mt-4">
              <h3 className="text-center font-semibold mb-2">Captured Image Preview:</h3>
              <img src={capturedImage} alt="Captured" className="w-full rounded-lg border border-gray-300" />
            </div>
          )}
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full mb-2 border border-gray-300 rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
        {successMessage && <p className="text-green-600 mt-4 text-center">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 mt-4 text-center">{errorMessage}</p>}
      </form>
    </div>
  );
}

export default ReportIssue;

