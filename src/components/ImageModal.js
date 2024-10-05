import React, { useEffect, useRef } from 'react';
import UpvoteButton from './UpvoteButton';

const ImageModal = ({ image, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-lg p-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <img src={image.url} alt={image.generation_log.prompt} className="w-full h-auto mb-4" />
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Total Votes: {image.total_votes}</p>
          <UpvoteButton
            imageId={image.id}
          />
        </div>
        <p className="text-lg font-semibold mb-2">Prompt:</p>
        <p className="text-lg font-medium mb-2">{image.generation_log.prompt}</p>
        <p className="text-md mb-2">Model: {image.generation_log.model}</p>
        <p className="text-sm text-gray-500">Created at: {new Date(image.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ImageModal;