'use client';  

import React, { useState } from 'react';

const DreamAnalyzer = () => {
  const [dreamDescription, setDreamDescription] = useState('');
  const [analysis, setAnalysis] = useState('');

  const analyzeDream = async (description) => {
    try {
      const response = await fetch('/api/openai-dream-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dreamDescription: description }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing dream:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeDream(dreamDescription);  
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={dreamDescription}
          onChange={(e) => setDreamDescription(e.target.value)}
          placeholder="Describe your dream here..."
        />
        <button type="submit">Analyze Dream</button>
      </form>

      {analysis && (
        <div>
          <h2>Dream Analysis:</h2>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default DreamAnalyzer;
