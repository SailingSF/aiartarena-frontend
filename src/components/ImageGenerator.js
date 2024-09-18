import React, { useState } from 'react';

function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically make an API call to an AI image generation service
    // For now, we'll just set a placeholder image
    setGeneratedImage('https://via.placeholder.com/300x300?text=Generated+Image');
  };

  return (
    <div className="image-generator">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a description for the image"
          required
        />
        <button type="submit">Generate Image</button>
      </form>
      {generatedImage && (
        <div className="generated-image">
          <img src={generatedImage} alt="Generated" />
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;