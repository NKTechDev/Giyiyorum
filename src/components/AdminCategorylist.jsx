import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Box, Modal, IconButton } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react'; // Importing the useAuth0 hook
import axios from 'axios'; // We will use axios to fetch data from the API
import DeleteIcon from '@mui/icons-material/Delete'; // Delete icon for button
import { toast, ToastContainer } from 'react-toastify'; // Importing react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
import BASE_URL from '../constant';

const AdminCategoryPage = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0(); // Using Auth0's hook
  const [categories, setCategories] = useState([]); // To hold the fetched categories
  const [categoriesLoading, setCategoriesLoading] = useState(true); // Loading state for categories
  const [fetchError, setFetchError] = useState(null); // Error state for the fetch call
  const [openModal, setOpenModal] = useState(false); // State for opening the modal
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Category to be deleted

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/category`); // Replace with your API URL
        setCategories(response.data.categories); // Set the fetched categories
        setCategoriesLoading(false); // Set loading to false once categories are fetched
      } catch (err) {
        console.error('Kategoriler alınırken bir hata oluştu:', err);
        setFetchError('Kategoriler alınırken bir hata oluştu.');
        setCategoriesLoading(false); // Set loading to false if there's an error
      }
    };

    fetchCategories();
  }, []);

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  // Open the confirmation modal
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category); // Set the category to be deleted
    setOpenModal(true); // Open the modal
  };

  // Close the confirmation modal
  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
    setCategoryToDelete(null); // Reset the category to delete
  };

  // Handle the deletion of the category
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/v1/category/delete/${categoryToDelete._id}`);
      toast.success('Kategori başarıyla silindi!'); // Success toast message
      // Refresh the categories list after deletion
      setCategories(categories.filter((category) => category._id !== categoryToDelete._id));
      handleCloseModal(); // Close the modal
    } catch (err) {
      console.error('Kategori silinirken bir hata oluştu:', err);
      toast.error('Kategori silinirken bir hata oluştu.'); // Error toast message
    }
  };

  if (isLoading || categoriesLoading) {
    return (
      <Box
        sx={{
          background: 'white',
          minHeight: '100vh',
          padding: '20px',
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress color="inherit" />
        </Box>
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box
        sx={{
          background: 'white',
          minHeight: '100vh',
          padding: '20px',
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" height="100vh">
          <Typography variant="h6" color="black" gutterBottom>
            Bir şeyler yanlış gitti! Lütfen tekrar deneyin.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Giriş Yap
          </Button>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          background: 'white',
          minHeight: '100vh',
          padding: '20px',
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" height="100vh">
          <Typography variant="h5" color="black" gutterBottom>
            Lütfen siteyi kullanabilmek için giriş yapın.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Giriş Yap
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: 'white',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Typography variant="h4" gutterBottom align="center" color="black">
        Moda Kategorileri
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {categories.map((category) => (
          <Grid item xs={4} sm={4} md={3} key={category._id}>
            <Card
              sx={{
                maxWidth: 345,
                backgroundColor: '#333',
                borderRadius: '8px',
                boxShadow: '0px 8px 15px rgba(255, 255, 255, 0.3)', // Glow effect on hover

                '&:hover': {
                  transform: 'scale(1.05)', // Slightly scale the card up on hover
                  boxShadow: '0px 8px 15px rgba(144, 4, 4, 0.3)', // Glow effect on hover
                },
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition
              }}
            >
              <CardMedia
                component="img"
                alt={category.name}
                height="200"
                image={category.image}
                sx={{
                  height: {
                    xs: '50px', // Extra small devices (mobile)
                    sm: '50px', // Small devices
                    md: '100px', // Medium devices (tablets)
                    lg: '100px', // Large devices (desktops)
                    xl: '100px', // Extra large devices
                  },
                  width: {
                    xs: '100%', // Full width on mobile
                    sm: '100%',  // 90% width on small devices
                    md: '100%',  // 80% width on medium devices
                    lg: '100%',  // 70% width on large devices
                    xl: '100%',  // 60% width on extra large devices
                  },
                  overflow: 'hidden',
                  borderRadius: '8px',
                }}
              />
              <CardContent
                sx={{
                  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(34, 34, 34, 0.8))', // Linear gradient effect
                  borderRadius: '0 0 8px 8px',
                }}
              >
                <Typography
                  variant="h6"
                  align="center"
                  color="white"
                  sx={{
                    marginTop: 1,
                    whiteSpace: 'nowrap',        // Prevents text from wrapping to the next line
                    overflow: 'hidden',          // Hides the text that overflows the container
                    textOverflow: 'ellipsis',    // Adds ellipses when the text overflows
                    display: 'block',
                    fontSize: { xs: '0.75rem', sm: '1rem' }, // Smaller font size on mobile
                    // Ensures it's a block-level element for the overflow behavior
                  }}
                >
                  {category.name}
                </Typography>
              </CardContent>
              {/* Delete button */}
              <Box position="absolute" top={10} right={10}>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClick(category)} // Show confirmation modal
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Confirmation Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="confirm-delete-modal"
        aria-describedby="confirm-delete-description"
      >
        <Box
          sx={{
            width: 300,
            padding: 2,
            margin: 'auto',
            backgroundColor: '#333',
            borderRadius: '8px',
            color: 'white',
            textAlign: 'center',
            marginTop: '20%',
          }}
        >
          <Typography variant="h6" color="white" gutterBottom>
            Bu kategoriyi silmek istediğinize emin misiniz?
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleCloseModal} sx={{ marginRight: 2 }}>
            Vazgeç
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Onayla
          </Button>
        </Box>
      </Modal>

      {/* React Toastify Container */}
      <ToastContainer />
    </Box>
  );
};

export default AdminCategoryPage;
