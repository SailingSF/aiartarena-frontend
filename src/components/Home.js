import React from 'react';
import { Link } from 'react-router-dom';
import { LandPlot, Sparkles, Image, Grid, LogIn, LogOut, Info } from 'lucide-react';

const Button = ({ children, onClick, className, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-lg font-semibold transition duration-300 ${className}`}
  >
    {Icon && <Icon size={20} />}
    <span>{children}</span>
  </button>
);

const Home = ({ onLogout, onOpenAuthModal }) => {
  return (
    <div className="w-full md:w-3/4 mx-auto bg-white border-4 border-black rounded-xl p-6 shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">🏟️ Welcome to the Arena 🏟️</h1>
      <h3 className="text-xl font-bold mb-6 text-center">An easy way to make AI Images</h3>
      <div className="space-y-4 py-4">
        <div className="mb-6">
        <Link to="/arena">
          <Button className="bg-amber-400 text-black hover:bg-amber-500" icon={LandPlot}>
            THE ARENA
          </Button>
        </Link>
        </div>
        <div className="mb-4">
          <Link to="/generate">
            <Button className="bg-blue-500 text-white hover:bg-blue-600" icon={Sparkles}>
              Free Image Generator
            </Button>
          </Link>
        </div>
        <div className="mb-4">
          <Link to="/premium">
            <Button className="bg-purple-500 text-white hover:bg-purple-600" icon={Image}>
              <em>PREMIUM</em> Image Generator
            </Button>
          </Link>
        </div>
        <div className="mb-4">
          <Link to="/gallery">
            <Button className="bg-green-500 text-white hover:bg-green-600" icon={Grid}>
              Gallery
            </Button>
          </Link>
        </div>
      </div>
      <div className='mt-4'>
        <h3 className="text-xl font-bold mb-6 text-center">What is this?</h3>
        <div className="mb-4">
            <Link to="/info">
              <Button className="bg-gray-500 text-white hover:bg-gray-600" icon={Info}>
                Information
              </Button>
            </Link>
          </div>
      </div>
              
      <div className="border-t border-gray-200 p-4 mt-6 bg-gray-50 flex space-x-4">
        <Button onClick={onOpenAuthModal} className="bg-gray-200 text-gray-800 hover:bg-gray-300 flex-1" icon={LogIn}>
          Login
        </Button>
        <Button onClick={onLogout} className="bg-red-500 text-white hover:bg-red-600 flex-1" icon={LogOut}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Home;