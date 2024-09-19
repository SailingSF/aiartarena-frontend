import React, { useState, useEffect } from 'react';
import { useAPIKey } from './APIKeyContext';

const APIKeySetup = ({ isOpen, setIsOpen }) => {
  const [inputKey, setInputKey] = useState('');
  const { apiKey, saveApiKey } = useAPIKey();

  useEffect(() => {
    if (isOpen) {
      setInputKey(apiKey || '');
    }
  }, [isOpen, apiKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveApiKey(inputKey);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-black rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{apiKey ? 'Edit' : 'Enter'} HuggingFace API Key</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Paste your API key here"
            required
            className="w-full p-2 border-2 border-black rounded-md"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-gray-200 text-black font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default APIKeySetup;