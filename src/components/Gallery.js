import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ImageModal from './ImageModal';
import LoadingSpinner from './LoadingSpinner';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchImages(`${API_BASE_URL}/api/gallery-images/`);
  }, []);

  const fetchImages = async (url) => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      console.log('API response:', response.data); // Log the response for debugging
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (image) => setSelectedImage(image);
  const handleCloseModal = () => setSelectedImage(null);

  return (
    <div className="w-full md:w-3/4 mx-auto bg-white border-4 border-black rounded-xl overflow-hidden shadow-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Image Gallery</h1>
        <Link to="/" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300">
          Home
        </Link>
      </div>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.thumbnail_url}
                alt={image.generation_log.prompt}
                className="w-full h-48 object-cover cursor-pointer transition duration-300 group-hover:opacity-75"
                onClick={() => handleImageClick(image)}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <button 
                  className="bg-black bg-opacity-50 text-white px-3 py-1 rounded"
                  onClick={() => handleImageClick(image)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No images found.</p>
      )}

      {selectedImage && (
        <ImageModal image={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Gallery;