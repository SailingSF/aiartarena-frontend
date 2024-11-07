import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NSFWModal from './NSFWModal';
import APIKeySetup from './APIKeySetup';
import InPageNavbar from './InPageNavbar';
import axios from 'axios';
import { HfInference } from '@huggingface/inference';
import Tooltip from './Tooltip';

const models = [
  { id: "black-forest-labs/FLUX.1-schnell", name: "FLUX.1 Schnell (Great + Fast)", supportsNegativePrompt: false, speed: 'fast' },
  { id: "stabilityai/stable-diffusion-3.5-large-turbo", name: "Stable Diffusion 3.5 Large (Ok + Slow)", supportsNegativePrompt: true, speed: 'slow' },
  { id: "Shakker-Labs/FLUX.1-dev-LoRA-Logo-Design", name: "FLUX.1 (dev) Logo Design (Makes logos)", supportsNegativePrompt: false, speed: 'slow' },
  { id: "black-forest-labs/FLUX.1-dev", name: "FLUX.1 (Great + Slow)", supportsNegativePrompt: false, speed: 'slow' },
  { id: "Shakker-Labs/FLUX.1-dev-LoRA-AntiBlur", name: "FLUX.1 LoRA AntiBlur (Great for realistic)", supportsNegativePrompt: false, speed: 'slow' },
  { id: "XLabs-AI/flux-RealismLora", name: "Flux Realism (Great for realistic portraits)", supportsNegativePrompt: false, speed: 'slow' },
  { id: "Jovie/Midjourney", name: "'Midjourney Model Stlye' (Great for photorealistic to replicate midjourney)", supportsNegativePrompt: false, speed: 'slow' },
  { id: "enhanceaiteam/Flux-uncensored", name: "Flux Uncensored 🔥🔥🔥", supportsNegativePrompt: false, nsfw: true, speed: 'slow' }
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
  const [improvePrompt, setImprovePrompt] = useState(false);
  const [improvedPrompt, setImprovedPrompt] = useState(null);  
  const [showTutorial, setShowTutorial] = useState(true);
  const [isLoadingRandomPrompt, setIsLoadingRandomPrompt] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('hfApiKey');
    if (storedApiKey) {
      setHfApiKey(storedApiKey);
    }
  }, []);

  const clearAllPrompts = () => {
    setPrompt('');
    setNegativePrompt('');
    setImprovedPrompt(null);
    setGeneratedImageUrl(null);
  };

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
          improved_prompt: improvedPrompt,
          selected_model: selectedModel,
          improve_prompt: improvePrompt
        });
        imageUrl = response.data.image_url;
        setGeneratedImageUrl(imageUrl);
        setImprovedPrompt(response.data.improved_prompt);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      if (error.response && error.response.status === 400 && 
          error.response.data.message === "The request to the external API timed out") {
        alert("The request to the image generator timed out, try again in one second.");
      } else if (error.response && error.response.status === 504) {
        alert("The free image generator is taking too long to respond. This might work if you try again in a few seconds. Premium image generator doesn't have this problem.");
      } else {
        alert(`Error generating image: ${error.message}. ${hfApiKey ? "Please check your Hugging Face API key." : "This is probably not Max's fault. I would try again a few times before giving up. But I'm built different, so do you."}`);
      }
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

  const generateRandomPrompt = async () => {
    setIsLoadingRandomPrompt(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/random-prompt/`);
      setPrompt(response.data.prompt);
    } catch (error) {
      console.error("Error generating random prompt:", error);
      alert("Failed to generate a random prompt. Please try again.");
    } finally {
      setIsLoadingRandomPrompt(false);
    }
  };

  return (
    <div className="w-full md:w-3/4 mx-auto bg-white border-4 border-black rounded-xl overflow-hidden shadow-xl">
      <InPageNavbar pageColor="bg-blue-500" /> 
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 md:p-6">
        <h2 className="text-2xl md:text-4xl font-bold text-center">AI Image Generator</h2>
        <p className="text-center mt-2 text-gray-200 text-sm sm:text-base">
          {hfApiKey ? "Using your Hugging Face API key" : "All of the models. None of the subscriptions."}
        </p>
      </div>
      <div className="p-6 bg-stone-50">
        {showTutorial && (
          <div className="mb-4 p-4 bg-blue-100 rounded-md">
            <h3 className="font-bold mb-2">How to use the AI Image Generator:</h3>
            <ol className="list-decimal list-inside">
              <li>Select a model from the dropdown menu</li>
              <li>Enter a detailed description of the image you want to generate</li>
              <li>Optionally, enable "Pimp My Prompt" for AI-enhanced prompts</li>
              <li>Click "Generate Image" and wait for your creation!</li>
            </ol>
            <button 
              onClick={() => setShowTutorial(false)} 
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Got it, don't show this again
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="model" className="block text-sm font-bold text-gray-700 mb-1">Select Model</label>
            <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2 border-2 border-black rounded-md text-sm"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} {model.speed === 'fast' ? '⚡' : '🐢'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="prompt" className="block text-sm font-bold text-gray-700 mb-1">Image Prompt</label>
            <div className="relative">
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
            <div className="mt-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={generateRandomPrompt}
                disabled={isLoadingRandomPrompt}
                className="w-full sm:w-auto bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium py-2 px-4 rounded-md transition duration-300 text-sm flex items-center justify-center space-x-2"
              >
                <span role="img" aria-label="dice" className="text-xl">🎲</span>
                <span>{isLoadingRandomPrompt ? 'Loading...' : 'Random Prompt'}</span>
              </button>
              <div className="flex items-center space-x-2">
                <Tooltip text="Enhance your prompt with AI, this will take your original prompt and make it better.">
                  <label htmlFor="improvePrompt" className="text-sm font-medium text-gray-700 flex items-center space-x-1 cursor-pointer">
                    <span role="img" aria-label="magic wand" className="text-xl">🪄</span>
                    <span>Pimp My Prompt</span>
                  </label>
                </Tooltip>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={improvePrompt}
                    onChange={() => setImprovePrompt(!improvePrompt)}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-700 peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
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
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-md hover:from-blue-600 hover:to-blue-700 transition duration-300 disabled:opacity-50 text-sm md:text-base shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : 'Generate Image'}
            </button>
            <button 
              type="button" 
              onClick={clearAllPrompts}
              className="flex-1 bg-gray-200 text-black font-bold py-3 px-6 rounded-md hover:bg-gray-300 transition duration-300 text-sm md:text-base"
            >
              New Image
            </button>
          </div>
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
            {/* Add gallery link only when there's an image */}
            <div className="mt-6 text-center">
              <Link
                to="/gallery"
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition duration-300 font-bold"
              >
                Check Out and Vote on Other Generations
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm font-bold">Your generated image will appear here</p>
          </div>
        )}
      </div>
      {/* Add home button with black border */}
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
