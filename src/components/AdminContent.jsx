import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Tab, Tabs } from '@mui/material';
import AdminCategoryPage from './AdminCategorylist';
import VideoList from './VideoList';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import BASE_URL from '../constant';

const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState('categories'); // Tab control
  const [currentUser, setCurrentUser] = useState(null); // Store the current user data
  const { user, isAuthenticated, isLoading, error } = useAuth0();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/user/current/${user?.sub}`);
        setCurrentUser(response.data); // Assuming the role is in the fetched user data
        console.log(response.data)
      } catch (error) {
        console.error('Kullanıcı profilini alırken hata oluştu:', error);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]); // Only fetch when user is authenticated

  const handleTabChange = (event, newTab) => {
    setSelectedTab(newTab);
  };

  // Check if the user is an admin
  const isAdmin = currentUser?.role === 'admin'; // Assuming `role` is in user profile

  if (isLoading) {
    return <Typography variant="h6" sx={{ color: 'black' }}>Yükleniyor...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" sx={{ color: 'red' }}>Hata: {error.message}</Typography>;
  }

  return (
    <Box sx={{ padding: 2, backgroundColor: 'white', minHeight: '100vh' }}>

      {/* Title */}
      <Typography variant="h4" gutterBottom align="center" sx={{ color: 'black' }}>
        Admin Paneli
      </Typography>

      {/* Check if user is admin */}
      {isAdmin ? (
        <>
          {/* Tab Buttons */}
          <Tabs value={selectedTab} onChange={handleTabChange} centered sx={{ borderBottom: '1px solid black' }}>
            <Tab label="Kategori Listesi" value="categories" sx={{ color: 'black' }} />
            <Tab label="Bekleyen Videolar" value="pendingVideos" sx={{ color: 'black' }} />
          </Tabs>

          {/* Render CategoryList or PendingVideos based on selected tab */}
          {selectedTab === 'categories' && <AdminCategoryPage />}
          {selectedTab === 'pendingVideos' && <VideoList />}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', backgroundColor: 'white', color: 'black', padding: '20px' }}>
          <Typography variant="h5">
            Bu sayfayı görüntülemeye izniniz yok.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AdminPage;
