import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 flex items-center justify-center px-6 sm:px-12 md:px-20 lg:px-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white shadow-2xl rounded-3xl p-12 w-full max-w-xl text-center border border-gray-300">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to SmartChange Civic-App
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl mb-10">
          A simple and secure way to manage your civic data.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/register">
            <button className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white px-8 py-3 rounded-lg font-semibold transition-shadow shadow-md">
              Register
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-shadow shadow-md">
              Login
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
