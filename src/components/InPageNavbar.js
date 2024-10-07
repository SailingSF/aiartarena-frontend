import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LandPlot, Sparkles, Image, Grid, Info, LogIn } from 'lucide-react';
import AuthModal from './AuthModal';

const NavItem = ({ to, icon: Icon, children, isActive, activeColor, onClick }) => {
  const Component = to ? Link : 'button';
  return (
    <Component to={to} onClick={onClick}>
      <motion.div
        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
          isActive ? `${activeColor} text-white` : 'text-gray-700 hover:bg-purple-100'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon size={16} />
        <span>{children}</span>
      </motion.div>
    </Component>
  );
};

const InPageNavbar = ({ pageColor }) => {
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navItems = [
    { to: "/", icon: Home, text: "Home" },
    { to: "/arena", icon: LandPlot, text: "Arena" },
    { to: "/generate", icon: Sparkles, text: "Free Generator" },
    { to: "/premium", icon: Image, text: "Premium" },
    { to: "/gallery", icon: Grid, text: "Gallery" },
    { to: "/info", icon: Info, text: "Info" }
  ];

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthenticate = () => {
    // Handle authentication logic here
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md rounded-t-xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="w-24"></div>
            <div className="flex items-center justify-center flex-grow">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  isActive={location.pathname === item.to}
                  activeColor={pageColor}
                >
                  {item.text}
                </NavItem>
              ))}
            </div>
            <div className="w-24 flex justify-end">
              <NavItem
                icon={LogIn}
                onClick={handleOpenAuthModal}
                activeColor={pageColor}
              >
                Login
              </NavItem>
            </div>
          </div>
        </div>
      </nav>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onAuthenticate={handleAuthenticate}
      />
    </>
  );
};

export default InPageNavbar;