import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUser, useAuth } from '@clerk/nextjs';

const DreamSentimentChart = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [dreamData, setDreamData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

    const fetchDreamData = async () => {
      try {
        const token = await getToken();
        const response = await fetch('/api/dream-stats', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dream stats');
        }

        const data = await response.json();
        console.log('Fetched dream data:', data); // Log the fetched data

        if (!Array.isArray(data) || data.length === 0) {
          setError('No dream data available');
          return;
        }

        const processedData = data.map(dream => ({
          timestamp: new Date(dream.timestamp).toLocaleDateString(),
          sentimentScore: dream.sentiment || 0, // Assuming sentiment is a property in your data
        }));

        setDreamData(processedData);
      } catch (err) {
        console.error('Error fetching dream data:', err);
        setError(err.message || 'Failed to fetch data');
      }
    };

    fetchDreamData();
  }, [user, isLoaded, getToken, isSignedIn]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (dreamData.length === 0) {
    return <p>No dream sentiment data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={dreamData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis domain={[-1, 1]} /> {/* Assuming sentiment score ranges from -1 to 1 */}
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sentimentScore" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DreamSentimentChart;