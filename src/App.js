import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ArenaGenerator from './components/ArenaGenerator';
import FreeImageGenerator from './components/FreeImageGenerator';
import PremiumGenerator from './components/PremiumGenerator';
import Gallery from './components/Gallery';
import Info from './components/Info';
import Home from './components/Home';
import AuthModal from './components/AuthModal';
import usePageTracking from './usePageTracking';

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');

  usePageTracking(); 

  const handleOpenAuthModal = (message = '') => {
    setAuthModalMessage(message);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('User logged out');
  };

  const handleAuthenticate = (success) => {
    // Handle successful authentication
    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-4 sm:p-8 font-sans">
      <Routes>
        <Route path="/" element={<Home onOpenAuthModal={handleOpenAuthModal} onLogout={handleLogout} />} />
        <Route path="/arena" element={<ArenaGenerator openAuthModal={handleOpenAuthModal} />} />
        <Route path="/generate" element={<FreeImageGenerator />} />
        <Route path="/premium" element={<PremiumGenerator openAuthModal={handleOpenAuthModal} />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/info" element={<Info />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticate={handleAuthenticate}
        message={authModalMessage}
      />
    </div>
  );
}

function App() {
  useEffect(() => {
    ReactGA.initialize('G-EKLE5ZL133');
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
