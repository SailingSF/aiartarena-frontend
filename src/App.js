import React from 'react';
import ImageGenerator from './components/ImageGenerator';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Image Generator</h1>
      </header>
      <main className="App-main">
        <ImageGenerator />
      </main>
      <footer className="App-footer">
        <p>© 2024 AI Image Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;