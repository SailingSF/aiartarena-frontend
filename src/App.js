import React from 'react';
import ImageGenerator from './components/ImageGenerator';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Image Generator</h1>
      </header>
      <main>
        <ImageGenerator />
      </main>
    </div>
  );
}

export default App;