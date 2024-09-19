import React from 'react';

const NSFWModal = ({ isOpen, onClose, onConfirm, prompt }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">You are a sicko</h2>
        <p className="mb-6">You are about to use a model that may generate NSFW content. You sick freak.</p>
        <p className="mb-6 italic bg-gray-100 p-2 rounded">&quot;{prompt}&quot;</p>
        <p className="mb-6">You want AI to make you a NSFW picture of this? You are genuinely sick in the head.</p>
        <p className="mb-6">Seek Christ.</p>
        <div className="flex flex-col items-center mt-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-200 text-black rounded hover:bg-gray-300 transition duration-300 mb-2"
          >
            I will seek Christ ✝️
          </button>
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
          >
            I understand that I am sick in the head and I really want to see this gross image.
          </button>
        </div>
      </div>
    </div>
  );
};

export default NSFWModal;