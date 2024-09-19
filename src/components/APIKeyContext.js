import React, { createContext, useState, useContext, useEffect } from 'react';

const APIKeyContext = createContext();

export const useAPIKey = () => useContext(APIKeyContext);

export const APIKeyProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedApiKey = localStorage.getItem('huggingfaceApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('huggingfaceApiKey', key);
  };

  return (
    <APIKeyContext.Provider value={{ apiKey, saveApiKey }}>
      {children}
    </APIKeyContext.Provider>
  );
};