import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ onLogout }) => {
  return (
    <div className="max-w-md mx-auto bg-white border-4 border-black rounded-xl p-6 shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome</h1>
      <div className="space-y-4">
        <Link 
          to="/generate" 
          className="block w-full bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300 text-center"
        >
          Image Generator
        </Link>
        <Link 
          to="/gallery" 
          className="block w-full bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300 text-center"
        >
          Gallery
        </Link>
        <button
          onClick={onLogout}
          className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;