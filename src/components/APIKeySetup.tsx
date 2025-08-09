import React, { useState, useEffect } from 'react';
import type { ApiKeySetupProps } from '../types';

const APIKeySetup: React.FC<ApiKeySetupProps> = ({ isOpen, setIsOpen, onSave, onClear, initialApiKey }) => {
  const [inputKey, setInputKey] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setInputKey(initialApiKey || '');
    }
  }, [isOpen, initialApiKey]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSave(inputKey);
    setIsOpen(false);
  };

  const handleClear = (): void => {
    onClear();
    setInputKey('');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-black rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{initialApiKey ? 'Edit' : 'Enter'} HuggingFace API Key</h2>
        <h5 className="text-lg font-normal mb-2">Enter a huggingface API key to completely bypass the server and maintain your privacy. Go to <a className='text-blue-500 hover:underline' target="_blank" rel="noopener noreferrer" href='https://huggingface.co'>huggingface.co</a>, create a user and and then <a className='text-blue-500 hover:underline' target="_blank" rel="noopener noreferrer" href='https://huggingface.co/settings/tokens'>create a token</a> and paste it here.</h5>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Paste your API key here"
            required
            className="w-full p-2 border-2 border-black rounded-md"
          />
          <div className="flex justify-between space-x-2">
            <button
              type="button"
              onClick={handleClear}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
            >
              Clear Key
            </button>
            <div className="flex space-x-2">
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default APIKeySetup;


