import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ImageModal from './ImageModal';
import InPageNavbar from './InPageNavbar';
import LoadingSpinner from './LoadingSpinner';
import UpvoteButton from './UpvoteButton';
import type { GalleryResponse, ImageItem } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string | undefined;

const Gallery: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [previousPageUrl, setPreviousPageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!API_BASE_URL) return;
    fetchImages(`${API_BASE_URL}/api/gallery-images/`);
  }, []);

  const fetchImages = async (url: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axios.get<GalleryResponse>(url);
      setImages(response.data.results);
      setNextPageUrl(response.data.next);
      setPreviousPageUrl(response.data.previous);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching images:', error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = (): void => {
    if (nextPageUrl) {
      fetchImages(nextPageUrl);
      setCurrentPage((p) => p + 1);
    }
  };

  const handlePreviousPage = (): void => {
    if (previousPageUrl) {
      fetchImages(previousPageUrl);
      setCurrentPage((p) => p - 1);
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
                <div key={image.id ?? image.image_id} className="relative group aspect-square">
                  <img
                    src={image.thumbnail_url || image.url}
                    alt={image.generation_log.prompt}
                    className="w-full h-full object-cover cursor-pointer transition duration-300 group-hover:opacity-75"
                    onClick={() => setSelectedImage(image)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <button className="bg-black bg-opacity-50 text-white px-3 py-1 rounded mr-2 text-sm" onClick={() => setSelectedImage(image)}>
                      View
                    </button>
                    {image.id != null && <UpvoteButton imageId={image.id} />}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button onClick={handlePreviousPage} disabled={!previousPageUrl} className={`px-4 py-2 rounded ${previousPageUrl ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition duration-300`}>
                Previous
              </button>
              <span className="text-lg font-semibold">Page {currentPage}</span>
              <button onClick={handleNextPage} disabled={!nextPageUrl} className={`px-4 py-2 rounded ${nextPageUrl ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition duration-300`}>
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No images found.</p>
        )}

        {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
      </div>
    </div>
  );
};

export default Gallery;


