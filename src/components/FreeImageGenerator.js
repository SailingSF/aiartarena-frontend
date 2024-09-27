import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NSFWModal from './NSFWModal';
import APIKeySetup from './APIKeySetup';
import axios from 'axios';
import { HfInference } from '@huggingface/inference';

const models = [
  { id: "black-forest-labs/FLUX.1-schnell", name: "FLUX.1 Schnell (Great + Fast)", supportsNegativePrompt: false },
  { id: "stabilityai/stable-diffusion-2", name: "Stable Diffusion 2 (Ok + Slow)", supportsNegativePrompt: true },
  { id: "CompVis/stable-diffusion-v1-4", name: "Stable Diffusion 1.4 (Ok + reliable)", supportsNegativePrompt: true },
  { id: "black-forest-labs/FLUX.1-dev", name: "FLUX.1 (Great + Slow)", supportsNegativePrompt: false },
  { id: "stabilityai/stable-diffusion-xl-base-1.0", name: "Stable Diffusion XL Base 1.0 (Good + Slow)", supportsNegativePrompt: true },
  { id: "Shakker-Labs/FLUX.1-dev-LoRA-AntiBlur", name: "FLUX.1 LoRA AntiBlur (Great for realistic)", supportsNegativePrompt: false },
  { id: "XLabs-AI/flux-RealismLora", name: "Flux Realism (Great for realistic portraits)", supportsNegativePrompt: false },
  { id: "enhanceaiteam/Flux-uncensored", name: "Flux Uncensored 🔥🔥🔥", supportsNegativePrompt: false, nsfw: true }
];

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const FreeImageGenerator = ({ onLogout }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNSFWWarning, setShowNSFWWarning] = useState(false);
  const [hfApiKey, setHfApiKey] = useState(null);
  const [showAPIKeySetup, setShowAPIKeySetup] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('hfApiKey');
    if (storedApiKey) {
      setHfApiKey(storedApiKey);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      let imageUrl;
      if (hfApiKey) {
        // Use Hugging Face SDK
        const hf = new HfInference(hfApiKey);
        const result = await hf.textToImage({
          inputs: prompt,
          negative_prompt: negativePrompt,
          model: selectedModel,
        });

        // Convert blob to data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          imageUrl = reader.result;
          setGeneratedImageUrl(imageUrl);
        };
        reader.readAsDataURL(result);
      } else {
        // Use existing API
        const response = await axios.post(`${API_BASE_URL}/api/generate-image/`, {
          prompt,
          negative_prompt: negativePrompt,
          selected_model: selectedModel
        });
        imageUrl = response.data.image_url;
        setGeneratedImageUrl(imageUrl);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert(`Error generating image: ${error.message}. ${hfApiKey ? "Please check your Hugging Face API key." : "This is probably not Max's fault."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeyChange = (newApiKey) => {
    setHfApiKey(newApiKey);
    localStorage.setItem('hfApiKey', newApiKey);
    setShowAPIKeySetup(false);
  };

  const handleApiKeyClear = () => {
    setHfApiKey(null);
    localStorage.removeItem('hfApiKey');
    setShowAPIKeySetup(false);
  };

  const currentModel = models.find(model => model.id === selectedModel);

  return (
    <div className="w-full md:w-3/4 mx-auto bg-white border-4 border-black rounded-xl overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 md:p-6">
        <h2 className="text-2xl md:text-4xl font-bold text-center">AI Image Generator</h2>
        <p className="text-center mt-2 text-gray-200 text-sm sm:text-base">
          {hfApiKey ? "Using your Hugging Face API key" : "All of the models. None of the subscriptions."}
        </p>
      </div>
      <div className="p-6 bg-stone-50">
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300 disabled:opacity-50 text-sm md:text-base"
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
          <button 
            type="button"
            onClick={() => setShowAPIKeySetup(true)}
            className="w-full bg-gray-200 text-black font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300 text-sm md:text-base"
          >
            {hfApiKey ? 'Change API Key' : 'Set Up API Key'}
          </button>
        </form>
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
      <APIKeySetup
        isOpen={showAPIKeySetup}
        setIsOpen={setShowAPIKeySetup}
        onSave={handleApiKeyChange}
        onClear={handleApiKeyClear}
        initialApiKey={hfApiKey}
      />
    </div>
  );
};

export default FreeImageGenerator;