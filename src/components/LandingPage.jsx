import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import backgroundImageMobile from '../assets/land2.jpg'; // Mobile background image
import backgroundImageLarge from '../assets/land3.jpg'; // Large devices background image
import logo from '../assets/logo.jpg';
import BASE_URL from '../constant';

const LandingPage = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
 
  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6" color="white">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        {/* Content for authenticated users */}
        <Typography variant="h6" color="white">
          Welcome back, User!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundImage: {
          xs: `url(${backgroundImageMobile})`, // Mobile device
          sm: `url(${backgroundImageLarge})`,  // Tablet and large devices
        },
        backgroundSize: 'cover', // Ensure the image covers the whole area
        backgroundPosition: 'center', // Keep the image centered
        backgroundRepeat: 'no-repeat', // Prevent the image from repeating
        backgroundAttachment: 'fixed', // Make the background fixed for better scrolling effect
        width: '100%', // Ensure it takes up the full width
        minHeight: '100vh', // Make sure it takes the full height of the viewport
      }}
    >
      
        {/* Overlay for text background */}
        <Box
          sx={{
            padding: 2, // Add padding for spacing around text
            textAlign: 'center',
            justifyContent:'cneter',
            maxWidth: '100%', // Optional: constrain the width
          }}
        >

           <Typography
                              variant="h3"
                              color="dark blue"
                              sx={{
                                fontSize: { xs: '0.9rem', sm: '2rem' }, // Adjust font size for mobile
                                fontWeight: 'bold',
                                justifyContent:'cneter',
                                marginTop:1,
                                alignItems:'center'
                              }}
                            >
                              "Tum giyim videolarını..."
                            </Typography>


        

          {/* Action Buttons */}
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center', // Center buttons on mobile
            }}
          >
            {/* Add buttons here if needed */}
          </Box>
        </Box>
    </Box>
  );
};

export default LandingPage;
