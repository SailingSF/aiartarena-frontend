import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

type Status = 'activating' | 'success' | 'error';

const ActivateAccount: React.FC = () => {
  const [status, setStatus] = useState<Status>('activating');
  const [message, setMessage] = useState<string>('');
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/activate/`, { token });
        if (response.data.success || response.data.message) {
          setStatus('success');
          setMessage(response.data.message || 'Your account has been successfully activated!');
          setTimeout(() => navigate('/'), 5000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Activation error:', error);
        setStatus('error');
      }
    };

    if (token) {
      activateAccount();
    } else {
      setStatus('error');
    }
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-4">
      <Helmet>
        <title>Activate Account – AI Art Arena</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Account Activation</h1>
        {status === 'activating' && <p>Activating your account...</p>}
        {status === 'success' && (
          <div>
            <p className="text-green-600 mb-2">{message}</p>
            {!message.includes('already been verified') && <p>You have claimed your 20 free credits.</p>}
            <p className="mt-4">Redirecting to home page in 5 seconds...</p>
          </div>
        )}
        {status === 'error' && (
          <p className="text-red-600">There was an error activating your credits. Please try again or contact support.</p>
        )}
      </div>
    </div>
  );
};

export default ActivateAccount;


