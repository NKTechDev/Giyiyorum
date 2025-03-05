import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppBar, Toolbar, Button, IconButton, Box, Avatar, CircularProgress, Grid, Dialog, DialogActions, DialogContent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import {  Typography } from '@mui/material';


// import PersonIcon from '@mui/icons-material/Person';
// import MessageIcon from '@mui/icons-material/Message';
import { Person as PersonIcon, Home as HomeIcon, Message as MessageIcon } from '@mui/icons-material';
import logo from '../assets/logo.jpg'
import BASE_URL from '../constant';
import VideocamIcon from '@mui/icons-material/Videocam';


import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VideoUploadModal from './VideoUploadModal';
import ConversationList from './ConvesationList';
import UserList from './UserList';

const Header = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0();
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog state for mobile menu
  const [messageModalOpen, setMessageModalOpen] = useState(false); // State for message modal
  const navigate = useNavigate(); // useNavigate hook for navigation
  const [messages, setMessages] = useState([]); // State for messages
  const [unreadCount, setUnreadCount] = useState(0);
  const [domainName, setDomainName] = useState('Giyiyorum.com');
  const [slogan, setSlogan] = useState('Tüm giyim videolarını izleyin');



  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleAvatarClick = () => {
    navigate(`/user-profile/${user?.sub}`);
  };

  const handlHomeClick = () => {
    navigate(`/`);
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const handleProfileClick = () => {
    // Navigate to profile page
    navigate('/profile');
  };

  const handleMessageClick = () => {
    // Open message modal
    setMessageModalOpen(true);
  };

  const handleMessageClose = () => {
    setMessageModalOpen(false);
  };

  const handleHomeClick = () => {
    // Navigate to the home page (replace with your actual route)
    navigate('/');
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const userData = {
        given_name: user.given_name,
        family_name: user.family_name,
        nickname: user.nickname,
        name: user.name,
        picture: user.picture,
        email: user.email,
        email_verified: user.email_verified,
        sub: user.sub,
        updated_at: user.updated_at,
      };

      console.log('user data:', userData);

      axios.post(`${BASE_URL}/api/v1/user/saveUser`, userData)
        .then((response) => {
          console.log('User data saved:', response.data);
        })
        .catch((error) => {
          console.error('Error saving user data:', error);
        });
    }
  }, [isAuthenticated, user]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/message/users/${user?.sub}`);
        console.log('user message data ', response)
        setMessages(response.data); // Set user messages
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [user?.sub]);



  useEffect(() => {
    // Calculate total unread count
    const totalUnread = messages.reduce((acc, message) => acc + message.unreadCount, 0);
    console.log(totalUnread);
    setUnreadCount(totalUnread);
  }, [messages]);

  if (isLoading) {
    return (
      <AppBar position="sticky" sx={{ borderBottom: '1px solid white' }}>
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Box>
                <img src={logo} alt="Logo" style={{ width: '3vw', borderRadius: '50%', height: '3vw' }} />
              </Box>             </Grid>
            <Grid item>
              <CircularProgress color="inherit" sx={{ color: 'white' }} />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }

  if (error) {
    return (
      <AppBar position="sticky" sx={{ backgroundColor: 'black', borderBottom: '1px solid white' }}>
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Box>
                <img src={logo} alt="Logo" style={{ width: '3vw', borderRadius: '50%', height: '3vw' }} />
              </Box>               </Grid>
            <Grid item>
              <Button color="inherit" onClick={handleLogin}>Login</Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar position="sticky" sx={{
        background: "linear-gradient(45deg, darkblue, darkblue)",  // Gradient background
        backdropFilter: "blur(10px)",  // Blur effect on the background
        borderBottom: '1px solid white', borderBottom: '1px solid white'
      }}>
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            {/* Left side: App Logo */}
            <Grid item xs={6} sm={5} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              {isAuthenticated ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '7px',
                }}>
                  {/* Home Button */}
                  <IconButton
                    onClick={handleHomeClick}
                    sx={{
                      color: 'white',
                      backgroundColor: '#ff2b74', // TikTok-like pink color
                      fontSize: { xs: '20px', sm: '24px' }, // Smaller font size on mobile
                      padding: { xs: '6px', sm: '8px' }, // Smaller padding on mobile
                    }}
                  >
                    <HomeIcon sx={{ fontSize: 'inherit' }} />
                  </IconButton>

                  {/* Video Button */}
                  <IconButton
                    onClick={handleModalOpen}
                    sx={{
                      color: 'white',
                      backgroundColor: '#ff2b74', // TikTok-like pink color
                      fontSize: { xs: '20px', sm: '24px' }, // Smaller font size on mobile
                      padding: { xs: '6px', sm: '8px' }, // Smaller padding on mobile
                    }}
                  >
                    <VideocamIcon sx={{ fontSize: 'inherit' }} />
                  </IconButton>

                  {/* Profile Button */}
                  <IconButton
                    onClick={handleAvatarClick}
                    sx={{
                      color: 'white',
                      backgroundColor: '#ff2b74', // TikTok-like pink color
                      fontSize: { xs: '20px', sm: '24px' }, // Smaller font size on mobile
                      padding: { xs: '6px', sm: '8px' }, // Smaller padding on mobile
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 'inherit' }} />
                  </IconButton>

                  {/* Message Button */}
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <IconButton
                      onClick={handleMessageClick}
                      sx={{
                        color: 'white',
                        backgroundColor: '#ff2b74', // TikTok-like pink color
                        fontSize: { xs: '20px', sm: '24px' }, // Smaller font size on mobile
                        padding: { xs: '6px', sm: '8px' }, // Smaller padding on mobile
                      }}
                    >
                      <MessageIcon sx={{ fontSize: 'inherit' }} />
                    </IconButton>

                    {unreadCount > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: 'red',
                          color: 'white',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}
                      >
                        {unreadCount}
                      </Box>
                    )}
                  </Box>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '7px' }}>
                  {/* Login Button */}

                  <Typography
                    variant="h3"
                    color="white"
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '2rem' }, // Adjust font size for mobile
                      fontWeight: 'bold',
                      justifyContent:'cneter',
                      marginTop:1,
                      alignItems:'center'
                    }}
                  >
                    {domainName}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    sx={{
                      color: 'white',
                      background: 'linear-gradient(45deg, #ff2b74, #ff2b74)', // TikTok-like pink color
                      borderRadius: '20px',
                      padding: { xs: '6px 5px' }, // Adjust padding for mobile
                      display: 'flex',
                      marginRight: 1,
                      fontSize: { xs: '3vw', sm: '0.9vw' }, // Responsive font size based on screen size
                      alignItems: 'center',
                      boxShadow: '0px 4px 10px rgba(152, 10, 55, 0.1)',
                      transition: 'all 0.3s ease',
                      width: { xs: '80%', sm: 'auto' }, // Button width will be 80% on mobile, auto on larger screens
                      justifyContent: 'center', // Ensure text is centered
                      whiteSpace: 'nowrap', // Prevent text from breaking into multiple lines
                      textTransform: 'capitalize', // Automatically capitalize the first letter of each word

                      '&:hover': {
                        background: 'linear-gradient(45deg, rgb(7, 76, 85), rgb(14, 46, 206))',
                        color: 'white',
                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    Giriş Yap
                  </Button>


                  {/* Register Button */}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleLogin}
                    sx={{
                      color: 'white',
                      background: 'linear-gradient(45deg, #ff2b74, #ff2b74)', // TikTok-like pink color
                      borderRadius: '20px',
                      padding: { xs: '6px 6px'}, // Adjust padding for mobile
                      display: 'flex',
                      marginRight: 1,
                      fontSize: { xs: '3vw', sm: '0.9vw' }, // Responsive font size based on screen size
                      alignItems: 'center',
                      boxShadow: '0px 4px 10px rgba(152, 10, 55, 0.1)',
                      transition: 'all 0.3s ease',
                      width: { xs: '80%', sm: 'auto' }, // Button width will be 80% on mobile, auto on larger screens
                      textTransform: 'capitalize', // Automatically capitalize the first letter of each word

                      justifyContent: 'center', // Ensure text is centered
                      whiteSpace: 'nowrap', // Prevent text from breaking into multiple lines
                      '&:hover': {
                        background: 'linear-gradient(45deg, rgb(7, 76, 85), rgb(14, 46, 206))',
                        color: 'white',
                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    Kayıt OI.
                  </Button>
                   

                  
                </div>
              )}

            </Grid>

            {/* Hamburger Menu for Mobile and Tablets */}
            <Grid item xs={6} sm={3} container justifyContent="flex-end" display={{ xs: 'flex', sm: 'none' }}>
              <IconButton onClick={() => setDialogOpen(true)} color="inherit">
                <MenuIcon />
              </IconButton>
            </Grid>

            {/* Right side: Login/Logout with Avatar (visible on desktop only) */}
            <Grid item xs={6} sm={4} container justifyContent="flex-end" alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={handleModalOpen}
                    sx={{
                      color: 'white',
                      background: 'linear-gradient(45deg, #ff2b74, #ff2b74)', // TikTok-like pink color
                      borderRadius: '20px',
                      padding: '6px 12px', // Adjusted for better size
                      display: 'flex',
                      marginRight: 2,
                      fontSize: { xs: '4vw', sm: '0.9vw' }, // Adjust font size based on screen size
                      alignItems: 'center',
                      boxShadow: '0px 4px 10px rgba(152, 10, 55, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(45deg, rgb(7, 76, 85), rgb(14, 46, 206))',
                        color: 'white',
                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <AddIcon sx={{ marginRight: 0 }} /> Upload
                  </Button>

                  <Avatar src={user?.picture} alt="User Avatar" style={{ width: 40, height: 40, marginRight: 10 }} />
                  <span style={{ marginRight: 15, color: 'white' }}>{user?.name}</span>

                  <Button onClick={handleLogout}
                    sx={{
                      color: 'black',
                      background: 'linear-gradient(45deg,rgb(190, 7, 44),rgb(182, 4, 4))',
                      borderRadius: '20px',
                      padding: '5px 10px',
                      display: 'flex',
                      fontSize: '0.9vw',

                      color: 'white',
                      alignItems: 'center',
                      boxShadow: '0px 4px 10px rgba(185, 6, 6, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(45deg, rgb(7, 76, 85), rgb(14, 46, 206))',
                        color: 'white',
                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
                        transform: 'scale(1.05)',
                      },
                    }}>
                    <LogoutIcon sx={{ marginRight: 0 }} /> Çıkış Yap
                  </Button>


               
                </>
              ) : (
                <Button
                  sx={{ color: 'white', border: '1px solid white', padding: '6px 16px', backgroundColor: 'transparent', '&:hover': { backgroundColor: 'white', color: 'black' }, display: 'flex', alignItems: 'center' }} onClick={handleLogin}>
                  <LoginIcon sx={{ marginRight: 1 }} /> Login
                </Button>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {/* Dialog for Mobile (Vertical Layout) */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent sx={{ padding: '20px', backgroundColor: 'white' }}>
          <Grid container direction="column" spacing={2}>
            {/* Search Bar */}
            {/* Display User Info (only if authenticated) */}
            {isAuthenticated && user && (
              <Grid item container direction="column" alignItems="center">
                <Avatar src={user.picture} alt="User Avatar" sx={{ width: 50, height: 50 }} />
                <span style={{ color: 'black', marginTop: 10 }}>{user.name}</span>
              </Grid>
            )}

            {/* Buttons */}
            <Grid item>
              {isAuthenticated ? (
                <>
                  <Button fullWidth onClick={handleLogout} startIcon={<LogoutIcon />} sx={{ color: 'black' }}>
                    Çıkış Yap
                  </Button>
                </>
              ) : (
                <Button fullWidth onClick={handleLogin} startIcon={<LoginIcon />} sx={{ color: 'black' }}>
                  Giriş Yap
                </Button>
              )}

            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary" sx={{ color: 'black' }}>
            Kapat

          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={messageModalOpen} onClose={handleMessageClose}>
        <DialogContent sx={{ padding: '20px', backgroundColor: 'white' }}>
          <UserList sub={user?.sub} />
        </DialogContent>
      </Dialog>

      {/* Fixed Position Profile and Message Buttons */}


      {/* Video Upload Modal */}
      <VideoUploadModal open={modalOpen} handleClose={handleModalClose} />
    </>
  );
};

export default Header;
