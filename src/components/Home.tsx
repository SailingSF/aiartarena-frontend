import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandPlot, Sparkles, Image as ImageIcon, Grid, LogIn, LogOut, Info as InfoIcon } from 'lucide-react';
import axios from 'axios';
import ImageModal from './ImageModal';
import type { ImageItem } from '../types';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ComponentType<any>;
  to?: string;
  primary?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, icon: Icon, to, primary }) => {
  const baseStyles = 'w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-lg font-semibold transition-colors duration-300';
  const primaryStyles = primary ? 'bg-amber-400 text-black hover:bg-amber-500 ring-4 ring-yellow-400 ring-opacity-50' : className || '';

  const buttonContent = (
    <>
      {Icon && <Icon size={24} />}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link to={to} className={`${baseStyles} ${primaryStyles}`}>
          {buttonContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button onClick={onClick} className={`${baseStyles} ${primaryStyles}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      {buttonContent}
    </motion.button>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
    <Icon size={32} className="text-amber-500 mb-4" />
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

interface HomeProps {
  onLogout: () => void;
  onOpenAuthModal: () => void;
}

const Home: React.FC<HomeProps> = ({ onLogout, onOpenAuthModal }) => {
  const [topImage, setTopImage] = useState<ImageItem | null>(null);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchTopImage = async (): Promise<void> => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/top-image/`);
        setTopImage(response.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching top image:', error);
      }
    };

    fetchTopImage();
  }, []);

  const handleOpenAuthModal = (): void => {
    onOpenAuthModal();
  };

  return (
    <div className="w-full md:w-3/4 mx-auto bg-white border-4 border-black rounded-xl p-6 shadow-xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">🏟️ Welcome to the Arena 🏟️</h1>
        <p className="text-xl text-gray-700 mb-6">Your creative playground for AI image generation - compare models, create stunning images, and join our community</p>
      </motion.div>

      {topImage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">🏆 Top Generation 🏆</h2>
          <div className="relative group w-fit mx-auto">
            <img src={topImage.url} alt={topImage.generation_log.prompt} className="h-64 object-contain rounded-lg cursor-pointer transition duration-300 group-hover:opacity-90 shadow-xl" onClick={() => setShowImageModal(true)} />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <button className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg" onClick={() => setShowImageModal(true)}>
                View Details
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {showImageModal && topImage && (
        <ImageModal image={topImage} onClose={() => setShowImageModal(false)} customButton={<Link to="/gallery" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">View in Gallery</Link>} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <FeatureCard title="Compare Models" description="Test different AI models side by side in the Arena" icon={LandPlot} />
        <FeatureCard title="Generate Images" description="Create AI art with free and premium models" icon={Sparkles} />
        <FeatureCard title="Community Gallery" description="Share creations and get inspired by others" icon={Grid} />
      </div>

      <div className="space-y-6 py-4 px-2">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <p className="text-center mb-2 font-medium">Compare AI image models</p>
          <Button to="/arena" className="bg-amber-400 text-black hover:bg-amber-500 ring-4 ring-yellow-400 ring-opacity-50" icon={LandPlot} primary>
            THE ARENA
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <p className="text-center mb-2 font-medium">Generate Free AI images with HuggingFace</p>
          <Button to="/generate" className="bg-blue-500 text-white hover:bg-blue-600" icon={Sparkles}>
            Free Image Generator
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-center mb-2 font-medium">Access premium AI models faster and with assisted prompting</p>
          <Button to="/premium" className="bg-purple-500 text-white hover:bg-purple-600" icon={ImageIcon}>
            <em>PREMIUM</em> Image Generator
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <p className="text-center mb-2 font-medium">Browse and upvote images, compare models and prompts</p>
          <Button to="/gallery" className="bg-green-500 text-white hover:bg-green-600" icon={Grid}>
            Gallery
          </Button>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-center">Unlock Premium Features</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="text-amber-500" size={20} />
            <p className="text-gray-700">Access faster premium AI models</p>
          </div>
          <div className="flex items-center space-x-2">
            <LandPlot className="text-amber-500" size={20} />
            <p className="text-gray-700">Compare models side-by-side in The Arena</p>
          </div>
          <div className="flex items-center space-x-2">
            <Grid className="text-amber-500" size={20} />
            <p className="text-gray-700">Upvote your favorite generations</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <Button onClick={handleOpenAuthModal} className="bg-amber-400 text-black hover:bg-amber-500 ring-4 ring-yellow-400 ring-opacity-50 flex-1" icon={LogIn} primary>
            Login to Get Started
          </Button>
          <Button onClick={onLogout} className="bg-gray-200 text-gray-800 hover:bg-gray-300 flex-1" icon={LogOut}>
            Logout
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-center">What is this?</h3>
        <div>
          <Button to="/info" className="bg-gray-500 text-white hover:bg-gray-600" icon={InfoIcon}>
            Information
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;


