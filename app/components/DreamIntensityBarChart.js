import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DreamIntensityBarChart = ({ dreamData }) => {
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    if (!dreamData || dreamData.length === 0) {
      setProcessedData([]);
      return;
    }

    console.log('Raw dreamData:', dreamData); // Debugging line

    const data = dreamData.map(dream => {
      const timestamp = dream.timestamp?.seconds ? new Date(dream.timestamp.seconds * 1000).toLocaleDateString() : 'Invalid Date'; // Check if seconds exists
      return {
        timestamp, // Use the formatted timestamp
        intensity: dream.intensity || 0,
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    console.log('Processed data:', data); // Debugging line
    setProcessedData(data);
  }, [dreamData]);

  if (processedData.length === 0) {
    return <p>No dream intensity data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="intensity" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DreamIntensityBarChart;