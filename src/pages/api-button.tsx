import { useState, useEffect } from 'react';

const ApiButton = () => {
  const [message, setMessage] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);

  const fetchMessage = async () => {
    try {
      console.log('Button clicked, fetching message...');
      const response = await fetch('http://localhost:8000/');
      const data = await response.json();
      console.log('API response:', data);
      setMessage(data.message);
      setButtonClicked(true);
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  useEffect(() => {
    console.log('buttonClicked:', buttonClicked);
    console.log('message:', message);
  }, [buttonClicked, message]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <button
        onClick={fetchMessage}
        className="px-4 py-2 text-white bg-blue-500 rounded"
      >
        Fetch Message
      </button>
      {buttonClicked && message && <h1 className="mt-4 text-2xl font-bold">{message}</h1>}
    </div>
  );
};

export default ApiButton;
