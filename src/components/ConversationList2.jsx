import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Box, Paper } from '@mui/material';
import { styled } from '@mui/system';
import BASE_URL from '../constant';

// Helper function to format the timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); // You can customize the format as needed
};

const MessageContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxHeight: '400px',
  overflowY: 'auto',
  padding: '10px',
  marginBottom: '20px',
  backgroundColor: '#ECE5DD', // Light grey background similar to WhatsApp
}));

const MessageBubble = styled(Paper)(({ theme, sent }) => ({
  padding: '10px 15px',
  borderRadius: '7.5px',
  maxWidth: '70%',
  backgroundColor: sent ? '#DCF8C6' : '#FFFFFF', // Light green for sent messages, white for received
  color: '#000', // Black text for both sent and received messages
  alignSelf: sent ? 'flex-end' : 'flex-start', // Sent messages go to the right, received to the left
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  position: 'relative',
  wordWrap: 'break-word',
  boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)', // Subtle shadow for depth
}));

const Timestamp = styled(Typography)(({ theme, sent }) => ({
  fontSize: '0.6rem',
  color: '#666', // Grey color for timestamps
  alignSelf: 'flex-end', // Align timestamp to the bottom right
}));

const ConversationList2 = ({ recId, senderId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  // Fetch chat history when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/message/history/${senderId}/${recId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchMessages();
  }, [senderId, recId]);

  // Handle message input change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();

    if (text.trim()) {
      try {
        const response = await axios.post(`${BASE_URL}/api/v1/message/send`, {
          senderId: senderId,
          recId: recId,
          text,
        });

        // Update the messages state with the new message
        setMessages([...messages, response.data]);
        setText(''); // Clear the input
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        backgroundColor: '#ECE5DD', // Light grey background similar to WhatsApp
        borderRadius: '10px',
        padding: '20px',
        maxWidth: '500px',
        width: '100%',
        height: '100%',
        boxShadow: 3,
      }}
    >
      <MessageContainer>
        {messages.map((message) => (
          <MessageBubble key={message._id} sent={message.senderId === senderId}>
            <Typography variant="body1">{message.text}</Typography>
            <Timestamp sent={message.senderId === senderId}>
              {formatTimestamp(message.timestamp)}
            </Timestamp>
          </MessageBubble>
        ))}
      </MessageContainer>

      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <TextField
          value={text}
          onChange={handleTextChange}
          placeholder="Bir mesaj yaz..."
          fullWidth
          variant="outlined"
          size="small"
          multiline
          rows={2}
          sx={{
            borderRadius: '20px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px', // Rounded corners
              backgroundColor: '#FFFFFF', // White background for the input field
              color: '#000', // Black text for the input
            },
            '& .MuiInputBase-root': {
              color: '#000', // Black text color in the input
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#25D366', // WhatsApp green for the send button
            color: '#fff',
            '&:hover': { backgroundColor: '#128C7E' }, // Darker green on hover
            height: '40px',
            borderRadius: '20px', // Rounded corners for the button
          }}
        >
          Gönder
        </Button>
      </form>
    </Box>
  );
};

export default ConversationList2;