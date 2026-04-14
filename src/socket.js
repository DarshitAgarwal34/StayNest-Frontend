import { io } from 'socket.io-client';

import { getToken } from './api/api';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';

let socketInstance;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
    });
  }

  return socketInstance;
};

export const connectSocket = () => {
  const socket = getSocket();
  const token = getToken();

  if (!token) {
    if (socket.connected) {
      socket.disconnect();
    }
    return socket;
  }

  socket.auth = { token };

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const joinConversation = (conversationId) => {
  const socket = getSocket();

  if (socket.connected && conversationId) {
    socket.emit('joinConversation', conversationId);
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socketInstance?.connected) {
    socketInstance.disconnect();
  }

  socketInstance = undefined;
};

export default getSocket;
