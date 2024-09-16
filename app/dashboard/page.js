'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, ThemeProvider, createTheme, Grid } from '@mui/material';
import DreamThemePieChart from '../components/DreamThemePieChart';
import DreamSentimentChart from '../components/DreamSentimentChart';
import DreamIntensityBarChart from '../components/DreamIntensityBarChart';
import { useUser, useAuth } from '@clerk/nextjs';
import { fetchDreamAnalysis } from '@/utils/openai'; // A function to fetch OpenAI-generated themes and analysis

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a90e2', // Calming blue for primary color
    },
    secondary: {
      main: '#f6546a', // Vibrant red for accents
    },
    background: {
      default: '#fce4ec', // Light pink background
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const Dashboard = () => {
    const [feedback, setFeedback] = useState('');
    const [dreamData, setDreamData] = useState(null);
    const [error, setError] = useState(null);
    const { isLoaded, isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const [aiAnalysis, setAiAnalysis] = useState(''); // Store AI-generated insights
  
    useEffect(() => {
        if (!isLoaded || !isSignedIn || !user) {
          return;
        }

        // Call OpenAI to generate themes when the dashboard loads
        async function getAnalysis() {
          const response = await fetchDreamAnalysis(); // Fetch the dream analysis from OpenAI
          setAiAnalysis(response);
        }
        getAnalysis();

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
            console.log('Fetched dream data:', data);
    
            if (!Array.isArray(data) || data.length === 0) {
              setError('No dream data available');
              return;
            }
    
            setDreamData(data);
          } catch (err) {
            console.error('Error fetching dream data:', err);
            setError(err.message || 'Failed to fetch data');
          }
        };
    
        fetchDreamData();
      }, [user, isLoaded, getToken, isSignedIn]);
    

  const handleFeedbackSubmit = (event) => {
    event.preventDefault();
    console.log('User feedback:', feedback);
    setFeedback('');
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!dreamData) {
    return <Typography>Loading dream data...</Typography>;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 4, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        {/* Back to Home Link */}
        <a href="/" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            ← Back to Home
          </Typography>
        </a>

        <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
          Dream Analytics Dashboard
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                Recurring Dream Themes
              </Typography>
              <Paper elevation={3} sx={{ p: 2, borderRadius: '10px', backgroundColor: 'white' }}>
                <DreamThemePieChart data={dreamData} />
              </Paper>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                Dream Sentiment Over Time
              </Typography>
              <Paper elevation={3} sx={{ p: 2, borderRadius: '10px', backgroundColor: 'white' }}>
                <DreamSentimentChart data={dreamData} />
              </Paper>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                Dream Intensity Over Time
              </Typography>
              <Paper elevation={3} sx={{ p: 2, borderRadius: '10px', backgroundColor: 'white' }}>
                <DreamIntensityBarChart dreamData={dreamData} />
              </Paper>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}> {/* AI-generated Insights */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                AI Insights
              </Typography>
              <Paper elevation={3} sx={{ p: 2, borderRadius: '10px', backgroundColor: 'white' }}>
                <Typography>{aiAnalysis || 'Generating insights based on your dream data...'}</Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Feedback Form */}
        <Box component="form" onSubmit={handleFeedbackSubmit} sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Your Feedback
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="How did this dream make you feel?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mb: 2, backgroundColor: 'white', borderRadius: '5px' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: theme.palette.secondary.main,
              '&:hover': { backgroundColor: '#ff8a80' },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;