import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ImageModal from './ImageModal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages(`${API_BASE_URL}/api/gallery-images/`);
  }, []);

  const fetchImages = async (url) => {
    try {
      const response = await axios.get(url);
      setImages(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handlePreviousPage = () => {
    if (prevPage) fetchImages(prevPage);
  };

  const handleNextPage = () => {
    if (nextPage) fetchImages(nextPage);
  };

  return (
    <div className="w-full md:w-3/4 mx-auto bg-white border-4 border-black rounded-xl overflow-hidden shadow-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Image Gallery</h1>
        <Link
          to="/"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300"
        >
          Home
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.thumbnail_url}
            alt={image.generation_log.prompt}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handlePreviousPage}
          disabled={!prevPage}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={!nextPage}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
    
  );
};

export default Gallery;