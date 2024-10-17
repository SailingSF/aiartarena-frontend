import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ImageModal from './ImageModal';
import InPageNavbar from './InPageNavbar';
import LoadingSpinner from './LoadingSpinner';
import UpvoteButton from './UpvoteButton';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);

  useEffect(() => {
    fetchImages(`${API_BASE_URL}/api/gallery-images/`);
  }, []);

  const fetchImages = async (url) => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      console.log('API response:', response.data);
      setImages(response.data.results);
      setNextPageUrl(response.data.next);
      setPreviousPageUrl(response.data.previous);
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (image) => setSelectedImage(image);
  const handleCloseModal = () => setSelectedImage(null);

  const handleNextPage = () => {
    if (nextPageUrl) {
      fetchImages(nextPageUrl);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPageUrl) {
      fetchImages(previousPageUrl);
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full mx-auto bg-white border-4 border-black rounded-xl overflow-hidden shadow-xl">
      <InPageNavbar pageColor="bg-green-500" />
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 mt-4">
          <h1 className="text-3xl font-bold mb-2 sm:mb-0">Image Gallery</h1>
          <Link to="/" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300">
            Home
          </Link>
        </div>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : images.length > 0 ? (
          <>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group aspect-w-1 aspect-h-1">
                  <img
                    src={image.thumbnail_url}
                    alt={image.generation_log.prompt}
                    className="w-full h-full object-cover cursor-pointer transition duration-300 group-hover:opacity-75"
                    onClick={() => handleImageClick(image)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <button 
                      className="bg-black bg-opacity-50 text-white px-3 py-1 rounded mr-2 text-sm"
                      onClick={() => handleImageClick(image)}
                    >
                      View
                    </button>
                    <UpvoteButton imageId={image.id} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={handlePreviousPage}
                disabled={!previousPageUrl}
                className={`px-4 py-2 rounded ${
                  previousPageUrl ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } transition duration-300`}
              >
                Previous
              </button>
              <span className="text-lg font-semibold">Page {currentPage}</span>
              <button
                onClick={handleNextPage}
                disabled={!nextPageUrl}
                className={`px-4 py-2 rounded ${
                  nextPageUrl ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } transition duration-300`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No images found.</p>
        )}

        {selectedImage && (
          <ImageModal image={selectedImage} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

export default Gallery;
