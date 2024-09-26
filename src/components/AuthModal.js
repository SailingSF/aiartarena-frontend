import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const AuthModal = ({ isOpen, onClose, onAuthenticate }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      if (!isLogin && password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      try {
        const endpoint = isLogin ? '/api/login/' : '/api/register/';
        const data = isLogin 
          ? { email, password }
          : { email, password, username };
        
        const response = await axios.post(`${API_BASE_URL}`+endpoint, data);
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          onAuthenticate(true);
          onClose();
        } else {
          setError('Authentication failed');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred');
      }
    };
  
    const renderLoginForm = () => (
      <>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
      </>
    );
  
    const renderRegisterForm = () => (
      <>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Username (optional)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
      </>
    );
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
          <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleSubmit}>
            {isLogin ? renderLoginForm() : renderRegisterForm()}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-blue-600">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <p className="mt-4 text-center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setUsername('');
              }} 
              className="text-blue-500 hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
          <button onClick={onClose} className="mt-4 w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400">
            Close
          </button>
        </div>
      </div>
    );
  };
  
  export default AuthModal;