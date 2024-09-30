import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import usePageTracking from './components/usePageTracking';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ArenaGenerator from './components/ArenaGenerator';
import FreeImageGenerator from './components/FreeImageGenerator';
import PremiumGenerator from './components/PremiumGenerator';
import Gallery from './components/Gallery';
import Info from './components/Info';
import Home from './components/Home';
import AuthModal from './components/AuthModal';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  useEffect(() => {
    ReactGA.initialize('G-EKLE5ZL133'); // Replace with your Measurement ID
  }, []);

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('User logged out');
  };

  usePageTracking();

  return (
    <BrowserRouter>
      <div className="App min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-4 sm:p-8 font-sans">
        <Routes>
          <Route path="/" element={<Home onOpenAuthModal={handleOpenAuthModal} onLogout={handleLogout} />} />
          <Route path="/arena" element={<ArenaGenerator />} />
          <Route path="/generate" element={<FreeImageGenerator />} />
          <Route path="/premium" element={<PremiumGenerator />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/info" element={<Info />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthenticate={() => {}} // You can add login functionality here if needed
        />
      </div>
    </BrowserRouter>
  );
}

export default App;