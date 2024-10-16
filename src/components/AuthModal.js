import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const AuthModal = ({ isOpen, onClose, onAuthenticate, message }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
      // Clear messages when switching between login and register
      setError('');
      setSuccessMessage('');
    }, [isLogin]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccessMessage('');
  
      if (!isLogin && password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      try {
        const endpoint = isLogin ? '/api/login/' : '/api/register/';
        const data = isLogin 
          ? { email, password }
          : { email, password, userdisplay_name: username };
        
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('credits', response.data.user.credits);
          setSuccessMessage(
            isLogin
              ? 'Login successful!'
              : `${response.data.message} You're now signed in.`
          );
          setTimeout(() => {
            onAuthenticate(true);
            onClose();
          }, 1500); // Close the modal after 1.5 seconds
        } else {
          setError('Authentication failed. Please try again.');
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 400) {
            setError(error.response.data.message || 'Invalid input. Please check your details.');
          } else if (error.response.status === 401) {
            setError('Invalid credentials. Please try again.');
          } else if (error.response.status === 409) {
            setError('This email is already registered. Please login or use a different email.');
          } else {
            setError('An unexpected error occurred. Please try again later.');
          }
        } else if (error.request) {
          // The request was made but no response was received
          setError('No response from server. Please check your internet connection and try again.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError('An unexpected error occurred. Please try again later.');
        }
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
        <p className="text-sm text-gray-600 mb-4">
          After registration, check your email to verify your account and receive 20 free credits!
        </p>
      </>
    );
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
          <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Login' : 'Register'}</h2>
          {message && <p className="text-blue-500 mb-4">{message}</p>}
          <form onSubmit={handleSubmit}>
            {isLogin ? renderLoginForm() : renderRegisterForm()}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
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
                setSuccessMessage('');
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
