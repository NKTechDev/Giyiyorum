import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation for checking the current path
import Header from './Header';
import CategoryPage from './CategoryPage';
import BASE_URL from '../constant';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios'; // Ensure axios is imported

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const { user, isAuthenticated, isLoading, error } = useAuth0();
  const navigate = useNavigate(); // Initialize the navigate function
  const location = useLocation(); // Access current URL to prevent redirect loop

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.sub) {
        try {
          const response = await axios.get(`${BASE_URL}/api/v1/user/current/${user?.sub}`);
          setCurrentUser(response.data);

          // Check if the user is an admin
          if (response.data.role === 'admin' && location.pathname !== '/admin') {
            navigate('/admin'); // Redirect to admin page if role is admin and not already on admin page
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    // Fetch user profile only if the user is authenticated
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [user, isAuthenticated, navigate, location.pathname]); // Added location.pathname to avoid infinite redirects

  if (isLoading) {
    return <div>Loading...</div>; // You can show a loading indicator while the user info is being fetched
  }


  

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  

  return (
    <div>
      <Header />
      <CategoryPage />
    </div>
  );
};

export default HomePage;
