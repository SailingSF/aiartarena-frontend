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
import ActivateAccount from './components/ActivateAccount';
import usePageTracking from './usePageTracking';

function AppContent(): JSX.Element {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMessage, setAuthModalMessage] = useState<string>('');

  usePageTracking();

  const handleOpenAuthModal = (message: string = ''): void => {
    setAuthModalMessage(message);
    setIsAuthModalOpen(true);
  };

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    // Intentionally keep console for developer feedback
    // eslint-disable-next-line no-console
    console.log('User logged out');
  };

  const handleAuthenticate = (success: boolean): void => {
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
        <Route path="/activate/:token" element={<ActivateAccount />} />
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

function App(): JSX.Element {
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


