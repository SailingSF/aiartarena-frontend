import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InPageNavbar from './InPageNavbar';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ImageModal = ({ image, onClose }) => {
  const modalRef = React.useRef();

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <img src={image.url} alt={image.generation_log.prompt} className="w-full h-auto mb-4" />
        <p className="text-lg font-semibold mb-2">Prompt:</p>
        <p className="text-lg font-medium mb-2">{image.generation_log.prompt}</p>
        <p className="text-md mb-2">Model: {image.generation_log.model}</p>
        <p className="text-sm text-gray-500">Created at: {new Date(image.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

const ArenaGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const token = localStorage.getItem('token');
    
    if (!token) {
      setErrorMessage('Please log in to use this feature.');
      return;
    }

    setIsLoading(true);
    
    try {
      const config = {
        headers: { Authorization: `Token ${token}` }
      };
      
      const response = await axios.post(`${API_BASE_URL}/api/arena-generate/`, 
        { prompt },
        config
      );

      // Reshape the data to match the modal's expectations
      const reshapedResults = response.data.results.map(result => ({
        url: result.image_url,
        generation_log: {
          prompt: result.prompt,
          model: result.model
        },
        created_at: new Date().toISOString()
      }));

      setGeneratedImages(reshapedResults);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response && error.response.status === 403) {
        setErrorMessage("You don't have enough credits or are not at the right tier for this request.");
      } else {
        console.error("Error generating images:", error);
        setErrorMessage(`Error generating images: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="w-full md:w-3/4 mx-auto bg-white border-4 border-black rounded-xl overflow-hidden shadow-xl">
      <InPageNavbar pageColor="bg-amber-400" /> 
      <div className="bg-gradient-to-r from-amber-400 to-yellow-600 text-white p-4 md:p-6">
        <h2 className="text-2xl md:text-4xl font-bold text-center">AI Image Arena</h2>
        <p className="text-center mt-2 text-gray-200 text-sm sm:text-base">Compare AI models with one prompt</p>
      </div>
      <div className="p-6 bg-stone-50">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-bold text-gray-700 mb-1">Image Description</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate"
              required
              className="w-full p-2 border-2 border-black rounded-md text-sm"
              rows={3}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading || !isLoggedIn}
            className="w-full bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300 disabled:opacity-50 text-sm md:text-base"
          >
            {isLoading ? 'Generating...' : (isLoggedIn ? 'Generate Images' : 'Login to generate images')}
          </button>
        </form>
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
      </div>
      <div className="bg-stone-100 p-6">
        {generatedImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedImages.map((image, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <div className="aspect-w-1 aspect-h-1 mb-4">
                  <img 
                    src={image.url} 
                    alt={`Generated by ${image.generation_log.model}`} 
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{image.generation_log.model}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{image.generation_log.prompt}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm font-bold">Your generated images will appear here</p>
          </div>
        )}
      </div>
      <div className="bg-stone-50 p-4 border-t-2 border-black flex justify-center">
        <Link
          to="/"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300"
        >
          Home
        </Link>
      </div>
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default ArenaGenerator;