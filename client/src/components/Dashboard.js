import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(storedUser);
      fetchReports(storedUser._id); // Replace with actual user ID field
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state && location.state.newReport) {
      setReports((prevReports) => [location.state.newReport, ...prevReports]);
      // Clear the state so it doesn't add again on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchReports = async (userId) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/report?userId=${userId}`);
      setReports(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load reports', err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold mb-3">Welcome, {user?.username}</h1>
            <p className="text-gray-700 text-lg">Here's a summary of your reports</p>
          </div>
          <div className="mt-6 md:mt-0 flex space-x-4">
            <button
              className="bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white px-6 py-3 rounded-2xl font-semibold transition-shadow"
              onClick={() => navigate('/new-report')}
            >
              + New Report
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 text-white px-6 py-3 rounded-2xl font-semibold transition-shadow"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div>
          {loading ? (
            <p className="text-center text-gray-500 text-lg">Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="text-center text-gray-600 text-lg italic">No reports submitted yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
{reports.map((report) => (
  <div
    key={report._id}
    className="border border-gray-300 p-6 rounded-3xl bg-gray-50 hover:shadow-lg transition-shadow"
  >
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-xl font-bold">{report.title || 'Report'}</h2>

      <span
        className={`text-sm font-semibold px-4 py-1 rounded-full ${report.status === 'Resolved'
            ? 'bg-green-300 text-green-900'
            : 'bg-yellow-300 text-yellow-900'
          }`}
      >
        {report.status || 'Pending'}
      </span>
    </div>
    <p className="text-sm text-gray-600">
      Submitted on {new Date(report.createdAt).toLocaleDateString()}
    </p>
    {report.location && (
      <p className="text-sm text-gray-600 mt-2">
        Location: {(() => {
          try {
            const loc = JSON.parse(report.location);
            return `Latitude: ${loc.latitude.toFixed(6)}, Longitude: ${loc.longitude.toFixed(6)}`;
          } catch {
            return report.location;
          }
        })()}
      </p>
    )}
    {report.issueDescription && (
      <p className="text-gray-700 mt-3 whitespace-pre-wrap">{report.issueDescription}</p>
    )}
    {(report.imageUrl) && (
      <img
        src={report.imageUrl}
        alt="Captured"
        className="w-full mt-3 rounded-xl border"
      />
    )}
    {report.fileUrl && (
      <>
        {/\.(jpg|jpeg|png|gif)$/i.test(report.fileUrl) ? (
          <img
            src={report.fileUrl}
            alt="Uploaded file"
            className="w-full mt-3 rounded-xl border"
          />
        ) : (
          <div className="mt-3">
            <a
              href={report.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View uploaded file
            </a>
          </div>
        )}
      </>
    )}
  </div>
))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
