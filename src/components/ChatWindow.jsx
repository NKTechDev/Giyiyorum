import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../services/socket'; // Assuming socket instance is created here
import { useAuth0 } from '@auth0/auth0-react';
import BASE_URL from '../constant';

const ChatWindow = () => {
  const { conversationId } = useParams();
  const { user, isAuthenticated, isLoading, error } = useAuth0(); // Get user details from Auth0
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);  // To store current user data
  const history = useHistory();  // For navigation

  useEffect(() => {
    if (user) {
      // Fetch current user data
      const fetchCurrentUser = async () => {
        try {
          const sub = user.sub; // Get Auth0 user ID (sub)
          const response = await axios.get(`${BASE_URL}/api/v1/user/current/${sub}`, {
        
          });
          setCurrentUser(response.data); // Set current user
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      };

      fetchCurrentUser();
    }
  }, [user]);

  useEffect(() => {
    // Fetch messages for the conversation
    axios.get(`/api/chat/conversation/${conversationId}`)
      .then((response) => {
        setMessages(response.data.messages);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });

    // Set up socket listener
    socket.on('receive-message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, [conversationId]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        content: message,
        senderId: currentUser?._id, // Use the current user's ID
        conversationId,
      };

      // Emit message to server
      socket.emit('send-message', newMessage);

      // Update local state with the new message
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ marginBottom: '20px' }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <strong>{msg.senderId === currentUser?._id ? 'You' : 'Other'}:</strong> {msg.content}
            </div>
          ))
        ) : (
          <div>No messages yet</div>
        )}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ padding: '8px', width: '80%' }}
        />
        <button onClick={sendMessage} style={{ padding: '8px 16px' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
