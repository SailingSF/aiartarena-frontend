import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LandPlot, Sparkles, Image, Grid, Info, LogIn, Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';

const NavItem = ({ to, icon: Icon, children, isActive, activeColor, onClick, isMobile }) => {
  const Component = to ? Link : 'button';
  const content = (
    <div
      className={`flex items-center space-x-2 px-3 py-2 ${
        isMobile ? 'text-base w-full' : 'text-sm rounded-md'
      } font-medium ${
        isActive
          ? `${activeColor} text-white`
          : 'text-gray-700 hover:bg-purple-100'
      }`}
    >
      <Icon size={isMobile ? 20 : 16} />
      <span>{children}</span>
    </div>
  );

  return isMobile ? (
    <Component to={to} onClick={onClick} className="w-full">
      {content}
    </Component>
  ) : (
    <Component to={to} onClick={onClick} className="mx-1"> {/* Added mx-1 for horizontal margin */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {content}
      </motion.div>
    </Component>
  );
};

const MobileMenu = ({ navItems, activeColor, location, onItemClick }) => {
  return (
    <div className="bg-white shadow-md z-50">
      {navItems.map((item) => (
        <NavItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          isActive={location.pathname === item.to}
          activeColor={activeColor}
          onClick={onItemClick}
          isMobile={true}
        >
          {item.text}
        </NavItem>
      ))}
    </div>
  );
};

const InPageNavbar = ({ pageColor }) => {
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-md rounded-t-xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {isMobile ? (
              <>
                <div className="flex items-center">
                  <button onClick={toggleMobileMenu} className="text-gray-700 mr-2">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                  <span className="text-xl font-bold">Menu</span>
                </div>
                <div className="w-24 flex justify-end">
                  <NavItem
                    icon={LogIn}
                    onClick={handleOpenAuthModal}
                    activeColor={pageColor}
                    isMobile={true}
                  >
                    Login
                  </NavItem>
                </div>
              </>
            ) : (
              <>
                <div className="w-24"></div>
                <div className="flex items-center justify-center flex-grow space-x-2"> {/* Added space-x-2 for horizontal spacing */}
                  {navItems.map((item) => (
                    <NavItem
                      key={item.to}
                      to={item.to}
                      icon={item.icon}
                      isActive={location.pathname === item.to}
                      activeColor={pageColor}
                      isMobile={false}
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
                    isMobile={false}
                  >
                    Login
                  </NavItem>
                </div>
              </>
            )}
          </div>
        </div>
        {isMobile && isMobileMenuOpen && (
          <MobileMenu
            navItems={navItems}
            activeColor={pageColor}
            location={location}
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
        )}
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