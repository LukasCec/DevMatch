
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:5000', {
    autoConnect: false,
});

export const connectSocket = () => {
    const token = localStorage.getItem('token');
    socket.auth = { token };
    socket.connect();
};

export default socket;
