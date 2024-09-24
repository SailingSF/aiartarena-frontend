import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ImageGenerator from './components/ImageGenerator';
import Gallery from './components/Gallery';
import Home from './components/Home';
import PasswordSetup from './components/PasswordPrompt';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setIsPasswordModalOpen(true);
  };

  return (
    <BrowserRouter>
      <div className="App min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-4 sm:p-8 font-sans">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white border-4 border-black rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Password Required</h2>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300"
            >
              Enter Password
            </button>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home onLogout={handleLogout} />} />
            <Route path="/generate" element={<ImageGenerator />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
        <PasswordSetup
          isOpen={isPasswordModalOpen}
          setIsOpen={setIsPasswordModalOpen}
          onAuthenticate={setIsAuthenticated}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;