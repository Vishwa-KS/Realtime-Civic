// /src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">
          Civic App
        </Link>
        <div>
          <Link to="/" className="text-white mx-4">Home</Link>
          <Link to="/login" className="text-white mx-4">Login</Link>
          <Link to="/register" className="text-white mx-4">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
