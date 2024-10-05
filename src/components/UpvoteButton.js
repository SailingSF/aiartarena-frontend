import React, { useState } from 'react';
import axios from 'axios';
import { ThumbsUp } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UpvoteButton = ({ imageId, initialVotes, onVoteUpdate }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState(initialVotes);

  const handleUpvote = async () => {
    if (hasVoted) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
    
      if (!token) {
        alert('Please log in to upvote images.');
        return;
      }

      const config = {
        headers: { Authorization: `Token ${token}` }
      };

      const response = await axios.post(`${API_BASE_URL}/api/images/upvote/`, { image_id: imageId }, config);
      
      if (response.status === 200) {
        setHasVoted(true);
        const newVotes = votes + 1;
        setVotes(newVotes);
        onVoteUpdate(newVotes);
        console.log('Upvote successful:', response.data.message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert('Please log in to upvote images.');
        } else if (error.response.status === 429) {
          setHasVoted(true);
        } else {
          console.error('Error upvoting:', error.response.data);
        }
      } else {
        console.error('Error upvoting:', error);
      }
    }
  };

  return (
    <button
      onClick={handleUpvote}
      className={`p-2 rounded-full ${
        hasVoted
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } transition duration-300`}
      disabled={hasVoted}
      aria-label={hasVoted ? 'Already upvoted' : 'Upvote image'}
    >
      <ThumbsUp size={20} />
    </button>
  );
};

export default UpvoteButton;