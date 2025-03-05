import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true // Include credentials if required for authentication
});

export default socket;
