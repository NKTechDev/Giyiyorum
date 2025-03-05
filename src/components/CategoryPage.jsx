import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, TextField, InputAdornment } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LandingPage from './LandingPage';
import BASE_URL from '../constant';

const CategoryPage = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/category`);
        setCategories(response.data.categories);
        setFilteredCategories(response.data.categories); // Initialize with all categories
        setCategoriesLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setFetchError('Error fetching categories.');
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter categories based on the search query
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  if (isLoading || categoriesLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          padding: '20px',
          backgroundColor: 'white',
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress color="inherit" />
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ backgroundColor: 'transparent' }}>
        <LandingPage />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile, row on larger screens
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            marginBottom: { xs: 2, sm: 0 }, // Add space between the title and search box in mobile
            marginRight: { sm: 2 }, // Add space to the right in row layout
            color: 'black',
          }}
        >
          Moda Kategorileri
        </Typography>

        {/* Search Box */}
        <TextField
          variant="outlined"
          placeholder="Kategorilerde Ara..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: 'white',
            borderRadius: 2,
            padding: '0px', // Optional padding change
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'gray', // Gray border for clarity
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#ff2b74' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Conditional rendering for empty categories */}
      {filteredCategories.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            minHeight: '50vh',
          }}
        >
          <Typography variant="h6" color="black" gutterBottom>
            No categories found.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setSearchQuery('')}>
            Reset Search
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredCategories.map((category) => (
            <Grid item xs={4} sm={4} md={2} key={category._id}>
              <Card
                sx={{
                  backgroundColor: 'white',
                  border: "1px pink",
                  border: '1px solid #ff2b74', // Pink border

                  borderRadius: '8px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow effect
                  '&:hover': {
                    transform: 'scale(1.05)', // Slightly scale the card up on hover
                    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)', // Stronger shadow on hover
                  },
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition
                }}
                onClick={() => navigate(`/videos/${category.name}`, { state: { categoryImage: category.image } })} // Navigate on card click
              >
                <CardContent
                  sx={{
                    background: 'white',
                    borderRadius: '0 0 8px 8px',

                  }}
                >
                  {/* Image */}
                  <Box
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
                  >
                    <img
                      src={category.image} // Assuming each category has an imageUrl property
                      alt={category.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    align="center"
                    color="black"
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
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CategoryPage;
