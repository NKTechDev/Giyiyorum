import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, Typography, Avatar, Divider, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import ConversationList2 from './ConversationList2';
import BASE_URL from '../constant';

const UserList = ({ sub }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/message/users/${sub}`);
        console.log('user message data ', response);
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [sub]);

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter users based on search query
    const filtered = users.filter((user) =>
      user.userName.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  // Open modal with selected userId
  const handleOpenModal = (userId) => {
    setSelectedUserId(userId); // Set selected userId
    setOpenModal(true); // Open the modal
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUserId(null);
  };

  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        backgroundColor: '#181818', // Dark background for the container
        color: '#fff', // White text color for better contrast
        borderRadius: '10px',
        maxWidth: '400px',
        width: '100%',
        height: '100%',
        boxShadow: 3,
        overflowY: 'auto', // Enable scrolling if the list overflows
        maxHeight: '500px', // Set max height for scrolling
        margin: 'auto', // Center it for smaller screens
        '@media (max-width: 600px)': {
          padding: '10px',
          maxWidth: '100%',
        },
      }}
    >
      {/* Search Input */}
      <TextField
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search users..."
        variant="outlined"
        fullWidth
        size="small"
        sx={{
          marginBottom: '15px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            '& fieldset': {
              borderColor: '#666', // Lighter border color for dark mode
            },
            '&:hover fieldset': {
              borderColor: '#1ED4D0', // Highlighted border on focus
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1ED4D0', // Border color when focused
            },
          },
          '& .MuiInputBase-input': {
            color: '#fff', // Text color for input (white)
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#fff', // Placeholder text color (white)
          },
          '@media (max-width: 600px)': {
            fontSize: '0.8rem',
          },
        }}
      />

      {/* User Cards */}
      {filteredUsers.map((user) => (
        <Card
          key={user.userId}
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            borderRadius: '10px',
            backgroundColor: '#2a2a2a', // Dark background for each user card
            boxShadow: 1,
            transition: 'all 0.3s ease', // Smooth transition for hover effect
            '&:hover': { backgroundColor: '#333', boxShadow: 3 }, // Hover effect
            cursor: 'pointer',
          }}
          onClick={() => handleOpenModal(user.userId)} // Open modal on card click
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', flexGrow: 1 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                alt={user.userName}
                src={user.userProfilePic}
                sx={{ width: '50px', height: '50px', borderRadius: '50%' }}
              />
              {/* Display unread message count on Avatar */}
              {user.unreadCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    backgroundColor: '#1ED4D0',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                  }}
                >
                  {user.unreadCount}
                </Box>
              )}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: '#fff', // White text for the username
                  fontSize: '0.9rem',
                  marginBottom: '5px',
                  '@media (max-width: 600px)': {
                    fontSize: '0.8rem', // Adjust font size on mobile
                  },
                  whiteSpace: 'nowrap', // Prevent text from wrapping
                  overflow: 'hidden', // Hide overflowing text
                  textOverflow: 'ellipsis', // Add ellipsis for overflow text
                }}
              >
                {user.userName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#bbb', // Lighter color for the last message
                  fontSize: '0.9rem',
                  maxWidth: '250px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '@media (max-width: 600px)': {
                    fontSize: '0.8rem', // Adjust font size on mobile
                  },
                }}
              >
                {user.lastMessage}
              </Typography>
            </Box>
          </Box>
         
        </Card>
      ))}

      <Divider sx={{ margin: '10px 0', backgroundColor: '#444' }} />

      {/* Modal with Chat Component */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{backgroundColor: 'black', color: '#fff' }}>Chat</DialogTitle>
        <DialogContent sx={{ backgroundColor: 'black', color: '#fff' }}>
          {/* Pass selectedUserId as prop to the ChatComponent */}
          <ConversationList2 senderId={sub} recId={selectedUserId} />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#181818' }}>
          <Button onClick={handleCloseModal} color="primary" sx={{ color: '#1ED4D0' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;
