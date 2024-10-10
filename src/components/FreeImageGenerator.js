import React, { useState, useEffect } from 'react';
import NSFWModal from './NSFWModal';
import APIKeySetup from './APIKeySetup';
import InPageNavbar from './InPageNavbar';
import axios from 'axios';
import { HfInference } from '@huggingface/inference';
import { HelpCircle } from 'lucide-react';
import Tooltip from './Tooltip';

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
      if (error.response && error.response.status === 504) {
        alert("The free image generator is taking too long to respond. This might work if you try again in a few seconds. Premium image generator doesn't have this problem.");
      } else {
        alert(`Error generating image: ${error.message}. ${hfApiKey ? "Please check your Hugging Face API key." : "This is probably not Max's fault."}`);
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
            <label htmlFor="prompt" className="block text-sm font-bold text-gray-700 mb-1">Image Prompt</label>
            <div className="flex space-x-2">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image"
                required
                className="flex-grow p-2 border-2 border-black rounded-md text-sm"
                rows={3}
              />
              <button
                type="button"
                onClick={generateRandomPrompt}
                disabled={isLoadingRandomPrompt}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 text-sm"
              >
                {isLoadingRandomPrompt ? 'Loading...' : 'Random Prompt'}
              </button>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="improvePrompt" className="text-md font-medium text-gray-700">
                Pimp My Prompt
              </label>
              <Tooltip text="Uses AI to improve your prompt before generating the image">
                <HelpCircle 
                  size={16}
                  className="text-gray-500 cursor-help"
                />
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
          <div className="flex space-x-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300 disabled:opacity-50 text-sm md:text-base"
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