import React from 'react';
import type { NSFWModalProps } from '../types';

const NSFWModal: React.FC<NSFWModalProps> = ({ isOpen, onClose, onConfirm, prompt }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-[90%] sm:max-w-md">
        <h2 className="text-lg sm:text-xl text-center font-bold mb-3 sm:mb-4">You are a sicko</h2>
        <p className="mb-3 sm:mb-4 text-sm sm:text-base">You are about to use a model that may generate NSFW content. You sick freak.</p>
        <p className="mb-3 sm:mb-4 italic bg-gray-100 p-2 rounded text-sm sm:text-base">&quot;{prompt}&quot;</p>
        <p className="mb-3 sm:mb-4 text-sm sm:text-base">You want AI to make you a NSFW picture of this? You are genuinely sick in the head.</p>
        <p className="mb-4 sm:mb-6 text-sm sm:text-base">Seek Christ.</p>
        <div className="flex flex-col items-center mt-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-200 text-black rounded hover:bg-gray-300 transition duration-300 mb-2 text-sm sm:text-base"
          >
            I will seek Christ ✝️
          </button>
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 text-sm sm:text-base"
          >
            I understand that I am sick in the head and I really want to see this gross image.
          </button>
        </div>
      </div>
    </div>
  );
};

export default NSFWModal;


