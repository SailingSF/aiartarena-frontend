import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InPageNavbar from './InPageNavbar';
import NSFWModal from './NSFWModal';
import axios from 'axios';

const models = [
  { id: "flux/schnell", name: "FLUX.1 [schnell]", supportsNegativePrompt: false},
  { id: "flux/dev", name: "FLUX.1 [dev]", supportsNegativePrompt: false },
  { id: "stable-diffusion-v3-medium", name: "Stable Diffusion V3", supportsNegativePrompt: true },
  { id: "playground-v25", name: "Playground v2.5", supportsNegativePrompt: true },
  { id: "flux-pro", name: "FLUX.1.1 [pro]", supportsNegativePrompt: false },
];

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const PremiumGenerator = ({ openAuthModal }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [improvedPrompt, setImprovedPrompt] = useState(null);  
  const [isLoading, setIsLoading] = useState(false);
  const [showNSFWWarning, setShowNSFWWarning] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const clearAllPrompts = () => {
    setPrompt('');
    setNegativePrompt('');
    setImprovedPrompt(null);
    setGeneratedImageUrl(null);
  };

  const handleGenerateClick = () => {
    if (!isLoggedIn) {
      openAuthModal();
      setErrorMessage("Please log in to generate images.");
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setErrorMessage('');
    const token = localStorage.getItem('token');
    
    if (!token) {
      openAuthModal();
      return;
    }

    const currentModel = models.find(model => model.id === selectedModel);
    
    if (currentModel.nsfw) {
      setShowNSFWWarning(true);
    } else {
      generateImage();
    }
  };

  const generateImage = async () => {
    setIsLoading(true);
    setShowNSFWWarning(false);
    
    try {
      const token = localStorage.getItem('token');
    
      if (!token) {
        openAuthModal();
        return;
      }

      const config = {
        headers: { Authorization: `Token ${token}` }
      };
      const response = await axios.post(`${API_BASE_URL}/api/generate-image-premium/`, {
        prompt,
        improved_prompt: improvedPrompt || '',
        negative_prompt: negativePrompt,
        selected_model: selectedModel
        },
        config
      );

      setGeneratedImageUrl(response.data.image_url);
      setImprovedPrompt(response.data.improved_prompt);

    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response && error.response.status === 403) {
        setErrorMessage("You don't have enough credits or are not at the right membership tier for this request.");
      } else {
        console.error("Error generating image:", error);
        setErrorMessage(`Error generating image: ${error.message}."This is probably not Max's fault. I would try again a few times before giving up. But I'm built different, so do you."`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const currentModel = models.find(model => model.id === selectedModel);
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="w-full md:w-3/4 mx-auto bg-white border-4 border-black rounded-xl overflow-hidden shadow-xl">
      <InPageNavbar pageColor="bg-purple-500" /> 
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-4 md:p-6">
        <h2 className="text-2xl md:text-4xl font-bold text-center"><em>PREMIUM</em> AI Image Generator</h2>
        <p className="text-center mt-2 text-gray-200 text-sm sm:text-base">Good stuff and quicker</p>
      </div>
      <div className="p-6 bg-stone-50">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label htmlFor="model" className="block text-sm font-bold text-gray-700 mb-1">Select Model</label>
            <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2 border-2 border-black rounded-md text-sm"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="prompt" className="block text-sm font-bold text-gray-700 mb-1">Image Description</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image"
              required
              className="w-full p-2 border-2 border-black rounded-md text-sm"
              rows={3} 
            />
          </div>
          {currentModel.supportsNegativePrompt && (
            <div>
              <label htmlFor="negativePrompt" className="block text-sm font-bold text-gray-700 mb-1">Negative Prompt (Optional)</label>
              <input
                id="negativePrompt"
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="What to exclude from the image"
                className="w-full p-2 border-2 border-black rounded-md text-sm"
              />
            </div>
          )}
          {improvedPrompt && (
            <div>
              <label htmlFor="improvedPrompt" className="block text-sm font-bold text-gray-700 mb-1">Improved Prompt (Optional and Final)</label>
              <textarea
                id="improvedPrompt"
                value={improvedPrompt}
                onChange={(e) => setImprovedPrompt(e.target.value)}
                placeholder="AI improved prompt for this specific image model, this won't be altered"
                className="w-full p-2 border-2 border-black rounded-md text-sm"
                rows={4}
              />
          </div>
          )}
          <div className="flex space-x-4">
            <button 
              type="button"
              onClick={handleGenerateClick}
              className={`flex-1 font-bold py-2 px-4 rounded-md transition duration-300 text-sm md:text-base ${
                isLoggedIn 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
              }`}
            >
              {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
            <button 
              type="button" 
              onClick={clearAllPrompts}
              className="flex-1 bg-gray-300 text-black font-bold py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 text-sm md:text-base"
            >
              New Image
            </button>
          </div>
        </form>
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
      </div>
      <div className="bg-stone-100 p-6">
        {generatedImageUrl ? (
          <div className="w-full">
            <p className="text-center text-sm font-bold text-gray-700 mb-4">Your generated image:</p>
            <img src={generatedImageUrl} alt="Generated" className="mx-auto rounded-md border-2 border-black shadow-lg max-w-full h-auto" />
          </div>
        ) : (
          <div className="text-center text-gray-500 w-full">
            <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm font-bold">Your generated image will appear here</p>
          </div>
        )}
      </div>
      <div className="bg-stone-50 p-4 border-t-2 border-black flex justify-center">
        <Link
          to="/"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300"
        >
          Home
        </Link>
      </div>
      <NSFWModal
        isOpen={showNSFWWarning}
        onClose={() => {
          setShowNSFWWarning(false);
          window.open('https://www.vatican.va/', '_blank');
        }}
        onConfirm={() => {
          setShowNSFWWarning(false);
          generateImage();
        }}
        prompt={prompt}
      />
    </div>
  );
};

export default PremiumGenerator;
