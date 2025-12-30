import { io } from 'socket.io-client';

// In a real app, this would be an environment variable
const SERVER_URL = 'http://localhost:5000';

export const socket = io(SERVER_URL);
