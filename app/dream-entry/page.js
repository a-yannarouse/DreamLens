'use client';
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Checkbox, FormControlLabel, createTheme, ThemeProvider } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Mood from '@mui/icons-material/Mood'; // Import Mood icon
import Star from '@mui/icons-material/Star'; // Import Star icon

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a90e2', // Primary color
    },
    secondary: {
      main: '#f6546a', // Secondary color
    },
    background: {
      default: '#f0f4f8', // Background color
    },
  },
});

export default function DreamEntry() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const { user } = useUser(); // Log the user object for debugging
  console.log('User:', user); // Log the user object for debugging
  const [dreamDescription, setDreamDescription] = useState('');
  const [mood, setMood] = useState('');
  const [intensity, setIntensity] = useState('');
  const [analyzeDream, setAnalyzeDream] = useState(false); // New state for AI analysis option
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dreamAnalysis, setDreamAnalysis] = useState(''); // Store AI response

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Basic Validation
    if (!dreamDescription) {
      setError('Dream description is required.');
      return;
    }
  
    if (intensity && (intensity < 1 || intensity > 10)) {
      setError('Intensity must be between 1 and 10.');
      return;
    }
  
    try {
      const response = await fetch('/api/openai-dream-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dreamDescription, mood, intensity, analyzeDream }),
      });
  
      if (response.ok) {
        const result = await response.json();
        setSuccess('Dream saved successfully!');
        setDreamAnalysis(result.dreamAnalysis || '');
      } else {
        const result = await response.json();
        console.error('Error response:', result); 
        setError(result.error || 'Failed to save dream. Please try again.');
      }
    } catch (err) {
      console.error('Fetch error:', err); // Log the fetch error
      setError('An error occurred. Please try again.');
    }
  };
  
  if (!isSignedIn) {
    return <Typography>Please sign in to submit your dream.</Typography>;
  };

  return (
    <ThemeProvider theme={theme}> 
      <Box sx={{ 
        backgroundColor: theme.palette.background.default, 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, maxWidth: 600, margin: 'auto' }}>
          <Typography variant="h4" align="center" sx={{ mb: 3, color: theme.palette.primary.main }}>
            <Mood sx={{ verticalAlign: 'middle', mr: 1 }} /> Share Your Dream
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              required
              fullWidth
              id="dreamDescription"
              label="Describe your dream"
              name="dreamDescription"
              multiline
              rows={4}
              variant="outlined"
              value={dreamDescription}
              onChange={(e) => setDreamDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="mood"
              label="Mood before sleep"
              name="mood"
              variant="outlined"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="intensity"
              label="Dream Intensity (1-10)"
              name="intensity"
              type="number"
              variant="outlined"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              sx={{ mb: 2 }}
            />
            {/* AI Analysis Checkbox */}
            <FormControlLabel
              control={<Checkbox checked={analyzeDream} onChange={(e) => setAnalyzeDream(e.target.checked)} />}
              label="Request AI-Powered Dream Analysis"
              sx={{ mb: 2 }}
            />
            {dreamAnalysis && (
              <Typography color="secondary" align="center" sx={{ mb: 2 }}>
                AI Analysis: {dreamAnalysis}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              endIcon={<Star />} // Adding an icon to the button
            >
              Submit Dream
            </Button>
            <Button
              type="button" // Change type to button
              fullWidth
              variant="outlined" // Use outlined variant for distinction
              color="secondary" // Use secondary color
              sx={{ mt: 2 }} // Add margin top
              onClick={() => router.push('/dashboard')} // Redirect to dashboard
            >
              Go to Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}