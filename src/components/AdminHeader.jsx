import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppBar, Toolbar, Button, IconButton, TextField, Avatar, CircularProgress, Grid, Dialog, DialogActions, DialogContent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import VideoUploadModal from './VideoUploadModal';
import CategoryModal from './CategoryModal';
import BASE_URL from '../constant';
import { Person as PersonIcon, Home as HomeIcon, Message as MessageIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';



const AdminHeader = () => {
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0();
    const [modalOpen, setModalOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false); // Dialog state for mobile menu
    const navigate = useNavigate(); // useNavigate hook for navigation


    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const handleLogin = () => {
        loginWithRedirect();
    };

    const handleLogout = () => {
        logout({ returnTo: window.location.origin });
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

            axios.post(`${BASE_URL}/api/v1/user/saveUser`, userData)
                .then((response) => {
                    console.log('User data saved:', response.data);
                })
                .catch((error) => {
                    console.error('Error saving user data:', error);
                });
        }
    }, [isAuthenticated, user]);

    if (isLoading) {
        return (
            <AppBar position="sticky" sx={{ backgroundColor: 'black', borderBottom: '1px solid white' }}>
                <Toolbar>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <div>ADMIN</div>
                        </Grid>
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
                            <div>App Logo</div>
                        </Grid>
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
                        <Grid item xs={6} sm={4} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button
                                onClick={handleModalOpen}
                                sx={{
                                    color: 'black',
                                    background: 'linear-gradient(45deg, #00bcd4, #8e24aa)',
                                    borderRadius: '20px',
                                    padding: '6px 16px',
                                    display: 'flex',
                                    marginRight: 2,
                                    color: 'white',
                                    alignItems: 'center',
                                    boxShadow: '0px 4px 10px rgba(152, 10, 55, 0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, rgb(7, 76, 85), rgb(14, 46, 206))',
                                        color: 'white',
                                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
                                        transform: 'scale(1.05)',
                                    },
                                    // Mobile responsiveness: adjust padding and font size on smaller screens
                                    '@media (max-width: 600px)': {
                                        padding: '6px 12px',
                                        fontSize: '14px', // Decrease font size for mobile
                                    },
                                }}
                            >
                                <AddIcon sx={{ marginRight: 1 }} /> Oluştur
                            </Button>

                            {/* <IconButton
                                onClick={handleHomeClick}
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#ff2b74', // TikTok-like pink color
                                    fontSize: { xs: '20px', sm: '24px' }, // Smaller font size on mobile
                                    padding: { xs: '6px', sm: '8px' }, // Smaller padding on mobile
                                }}
                            >
                                <HomeIcon sx={{ fontSize: 'inherit' }} />
                            </IconButton> */}
                        </Grid>


                        {/* Hamburger Menu for Mobile and Tablets */}
                        <Grid item xs={6} sm={4} container justifyContent="flex-end" display={{ xs: 'flex', sm: 'none' }}>
                            <IconButton onClick={() => setDialogOpen(true)} color="inherit">
                                <MenuIcon />
                            </IconButton>
                        </Grid>

                        {/* Centered Search Bar (visible on desktop only) */}
                        <Grid item xs={6} sm={4} container justifyContent="center" sx={{ display: { xs: 'none', sm: 'block' } }}>

                        </Grid>

                        {/* Right side: Login/Logout with Avatar (visible on desktop only) */}
                        <Grid item xs={6} sm={4} container justifyContent="flex-end" alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                            {isAuthenticated ? (
                                <>
                                    {/* <Button
                                        onClick={handleModalOpen}
                                        sx={{
                                            color: 'black',
                                            background: 'linear-gradient(45deg, #00bcd4, #8e24aa)',
                                            borderRadius: '20px',
                                            padding: '6px 16px',
                                            display: 'flex',
                                            marginRight: 2,
                                            color: 'white',
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
                                        <AddIcon sx={{ marginRight: 1 }} /> Upload
                                    </Button> */}
                                    <Avatar src={user?.picture} alt="User Avatar" style={{ width: 40, height: 40, marginRight: 10 }} />
                                    <span style={{ marginRight: 15, color: 'white' }}>{user?.name}</span>
                                    <Button onClick={handleLogout}
                                        sx={{
                                            color: 'black',
                                            background: 'linear-gradient(45deg,rgb(190, 7, 44),rgb(182, 4, 4))',
                                            borderRadius: '20px',
                                            padding: '6px 16px',
                                            display: 'flex',
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
                                        }}>                    <LogoutIcon sx={{ marginRight: 1 }} />   Çıkış Yap

                                    </Button>
                                </>
                            ) : (
                                <Button
                                    sx={{ color: 'white', border: '1px solid white', padding: '6px 16px', backgroundColor: 'transparent', '&:hover': { backgroundColor: 'white', color: 'black' }, display: 'flex', alignItems: 'center' }} onClick={handleLogin}>
                                    <LoginIcon sx={{ marginRight: 1 }} />   Giriş Yap

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
                        Close
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Video Upload Modal */}
            <CategoryModal open={modalOpen} handleClose={handleModalClose} />
        </>
    );
};

export default AdminHeader;
