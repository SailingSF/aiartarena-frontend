import React, { useState } from 'react';
import { APIKeyProvider, useAPIKey } from './components/APIKeyContext';
import APIKeySetup from './components/APIKeySetup';
import ImageGenerator from './components/ImageGenerator';

function AppContent() {
  const [isEditingApiKey, setIsEditingApiKey] = useState(false);
  const { apiKey } = useAPIKey();

  const handleEditApiKey = () => {
    setIsEditingApiKey(true);
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-4 sm:p-8 font-sans">
      {!apiKey && (
        <div className="max-w-md mx-auto bg-white border-4 border-black rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">API Key Management</h2>
          <button
            onClick={() => setIsEditingApiKey(true)}
            className="w-full bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300"
          >
            Set API Key
          </button>
        </div>
      )}
      {apiKey && <ImageGenerator onEditApiKey={handleEditApiKey} />}
      <APIKeySetup isOpen={isEditingApiKey} setIsOpen={setIsEditingApiKey} />
    </div>
  );
}

function App() {
  return (
    <APIKeyProvider>
      <AppContent />
    </APIKeyProvider>
  );
}

export default App;