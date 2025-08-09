import React from 'react';
import { Link } from 'react-router-dom';
import InPageNavbar from './InPageNavbar';

const Info: React.FC = () => {
  return (
    <div className="w-full md:w-3/4 mx-auto bg-white border-4 border-black rounded-xl p-6 shadow-xl">
      <InPageNavbar pageColor="bg-gray-500" />
      <h1 className="text-3xl font-bold mb-6 mt-4 text-center">🏟️ About The Arena 🏟️</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What is The Arena?</h2>
        <p className="mb-4">AIArtArena.com is a platform that allows users to easily create AI-generated images. Whether you're an artist looking for inspiration, a content creator in need of unique visuals, or just someone who wants to make funny pictures, The Arena makes it easy to use and compare state of the art AI image models.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Free Image Generator: Create basic AI images at absolutely no cost and optionally use AI to enhance your prompt with "Pimp My Prompt".</li>
          <li>Premium Image Generator: Access advanced features and higher quality outputs using more premium models and with much faster generation.</li>
          <li>Gallery: Explore and get inspired by other users' creations and see how the models were prompted to create that image.</li>
          <li>The Arena: Generate multiple images from different models with the same prompt to compare albilities and prompt engineering.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Q: What are the benefits to the <em>PREMIUM</em> Image Generator</h3>
            <p>A: Faster access to some of the best available models, both open and closed weights. Automatic "prompt engineering" to make your prompts more likely to create cool images.</p>
          </div>
          <div>
            <h3 className="font-semibold">Q: Why would I use an API key on the free image generator?</h3>
            <p>A: Using your own API key takes this app completely out of the loop. Your prompt and image won't be stored by this app and shown to all in the gallery page. My free version comes with rate limits that have to be shared by all users, using your own key means you will only be subject to the rate limiting of your own API key. Privacy is the big reason, rate limits are the other.</p>
          </div>
          <div>
            <h3 className="font-semibold">Q: What if I don't like your prompt engineering?</h3>
            <p>A: After creating an image in the <em>PREMIUM</em> Generator you will get the "enhanced prompt" we turned it into. This was done in accordance with prompt engineering guidelines for that prompt. You can edit and submit a subsequent prompt from this field and the prompt won't be touched. This prompt is final. If you are requesting an image from the Dall-e-3 model, OpenAI applies their own prompt engineering (and safety) that is <em>not</em> editable.</p>
          </div>
          <div>
            <h3 className="font-semibold">Q: Who made this?</h3>
            <p>A: Max did. <a className='text-blue-700' href='https://linkedin.com/in/maxabouchar'>hire him</a>.</p>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <Link to="/" className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-lg font-semibold">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Info;


