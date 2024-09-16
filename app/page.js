'use client'
import Image from "next/image";
import './globals.css';
import { useUser } from '@clerk/nextjs';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Container, Typography, AppBar, Toolbar, Button, Box, Grid, ThemeProvider, createTheme, Paper, Avatar, CssBaseline, Stack, IconButton, Divider } from "@mui/material";
import Head from 'next/head';
import PsychologyIcon from '@mui/icons-material/Psychology';
import NightlightIcon from '@mui/icons-material/Nightlight';
import InsightsIcon from '@mui/icons-material/Insights';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import Slider from "react-slick";  
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const theme = createTheme({
  palette: {
    primary: {
      main: '#a1caff',
    },
    secondary: {
      main: '#ffb3ba',
    },
    background: {
      default: '#fce4ec',
    },
    text: {
      primary: '#333',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      color: '#333',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1.2rem',
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 300,
      color: '#555',
    }
  },
});

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleStartAnalyzing = () => {
    if (isSignedIn) {
      router.push('/dream-entry'); // Redirect to the Dream Entry Form
    } else {
      router.push('/sign-up');
    }
  };

  // Carousel Settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const testimonials = [
    { name: "Alex T.", review: "DreamLens helped me uncover recurring themes I had never noticed before.", avatar: "/user1.jpg" },
    { name: "Jamie L.", review: "The personalized insights have truly connected my dreams with my waking life.", avatar: "/user2.jpg" },
    { name: "Sarah M.", review: "The AI analysis has been eye-opening, revealing hidden patterns in my dreams!", avatar: "/user3.jpg" },
    { name: "Taylor R.", review: "I've never understood my dreams as well as I do now, thanks to DreamLens.", avatar: "/user4.jpg" },
    { name: "Jordan P.", review: "It feels like having a personal dream expert at my fingertips.", avatar: "/user5.jpg" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
        <Container maxWidth="100vw" sx={{ px: 0, flexGrow: 1 }}>
          <Head>
            <title>DreamsLens - Explore and Understand Your Dreams</title>
            <meta name="description" content='Log, analyze, and gain insights from your dreams using AI' />
          </Head>

          {/* Navbar */}
          <AppBar position='static' color="transparent" elevation={0} sx={{ backgroundColor: 'white', mb: 4 }}>
            <Toolbar>
              <Typography variant='h6' style={{ flexGrow: 1, fontWeight: 700, color: theme.palette.primary.main }}>
                DreamLens
              </Typography>
              <SignedOut>
                <Button color="primary" href='/sign-in'>Login</Button>
                <Button color="secondary" variant="contained" href='/sign-up'>Sign Up</Button>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button color="primary" sx={{ mr: 2 }}>Dashboard</Button> 
                </Link>
                <UserButton />
              </SignedIn>
            </Toolbar>
          </AppBar>

          {/* Hero Section */}
          <Box sx={{ py: 10, textAlign: 'center', backgroundColor: theme.palette.primary.main, color: 'white' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              <Typography variant="h1" sx={{ mb: 3 }}>Understand Your Dreams</Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>Log your dreams, uncover hidden patterns, and gain insights with our AI-powered dream analysis platform.</Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large" 
                onClick={handleStartAnalyzing}
                sx={{ 
                  fontSize: '1.2rem', 
                  py: 1.5, 
                  px: 4, 
                  borderRadius: '30px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
                  },
                }}
              >
                Start Analyzing Now
              </Button>
            </motion.div>
          </Box>

          {/* Features Section */}
          <Box sx={{ my: 10, px: 4 }}>
            <Typography variant="h2" gutterBottom textAlign="center" sx={{ mb: 8, color: theme.palette.primary.main }}>
              Why Choose DreamLens?
            </Typography>
            <Grid container spacing={4}>
              {[
                { icon: PsychologyIcon, title: "AI-Powered Analysis", description: "Our advanced AI interprets your dreams, identifying recurring themes and symbols." },
                { icon: NightlightIcon, title: "Pattern Recognition", description: "Discover patterns and trends in your dreams over time to gain deeper understanding." },
                { icon: InsightsIcon, title: "Personal Insights", description: "Gain valuable insights and connect your dreams to your waking life." },
              ].map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 4, 
                      height: '100%', 
                      borderRadius: '15px', 
                      backgroundColor: 'white',
                      transition: 'transform 0.3s',
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <feature.icon sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 2 }} />
                      <Typography variant='h4' gutterBottom color={theme.palette.primary.main}>
                        {feature.title}
                      </Typography>
                      <Typography>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Testimonials Section with Carousel */}
          <Box sx={{ my: 12, px: 4 }}>
            <Typography variant="h2" textAlign="center" sx={{ mb: 6, color: theme.palette.secondary.main }}>What Our Users Are Saying</Typography>
            <Slider {...settings} sx={{ backgroundColor: theme.palette.text.main }}> 
              {testimonials.map((testimonial, index) => (
                <Box key={index}>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                    <Paper elevation={4} sx={{ p: 4, textAlign: 'center', backgroundColor: 'white', borderRadius: '15px', maxWidth: '600px', margin: '0 auto' }}>
                      <Avatar src={testimonial.avatar} sx={{ width: 80, height: 80, margin: 'auto', mb: 4 }} />
                      <Typography variant="h5" gutterBottom>{testimonial.name}</Typography>
                      <Typography variant="body1">{testimonial.review}</Typography>
                    </Paper>
                  </motion.div>
                </Box>
              ))}
            </Slider>
          </Box>
          
          {/* Footer */}
          <Box textAlign="center" color="textSecondary" sx={{ mt: 4, py: 2, backgroundColor: theme.palette.primary.main }}>
            <Typography variant="body1" gutterBottom>
              Built with passion by <strong> A&apos;Yanna Rouse</strong>.
            </Typography>
            <Typography variant="body2">
              &copy; {new Date().getFullYear()} DreamLens. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
