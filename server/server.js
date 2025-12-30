const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const cors = require('cors');

app.use(cors());

const PORT = 5000;

app.get('/', (req, res) => {
    res.send('ConferCall Signaling Server is running');
});

io.on('connection', socket => {
    console.log('New user connected:', socket.id);

    socket.on('join-room', (roomId, userId) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        const isHost = !room || room.size === 0;

        console.log(`User ${userId} joined room ${roomId}. Host: ${isHost}`);
        socket.join(roomId);
        socket.join(userId); // Allow messaging specific user by userId

        // Notify the user if they are the host
        socket.emit('you-are-host', isHost);

        // Notify others in the room
        socket.to(roomId).emit('user-connected', userId);

        socket.on('end-room', () => {
            console.log(`Room ${roomId} ended by host ${userId}`);
            io.to(roomId).emit('room-ended');
            io.in(roomId).socketsLeave(roomId);
        });

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected from room ${roomId}`);
            socket.to(roomId).emit('user-disconnected', userId);
        });
    });

    // Handle Offer
    socket.on('offer', (payload) => {
        // payload: { target: string, caller: string, sdp: RTCSessionDescriptionInit }
        io.to(payload.target).emit('offer', payload);
    });

    // Handle Answer
    socket.on('answer', (payload) => {
        // payload: { target: string, caller: string, sdp: RTCSessionDescriptionInit }
        io.to(payload.target).emit('answer', payload);
    });

    // Handle ICE Candidate
    socket.on('ice-candidate', (payload) => {
        // payload: { target: string, candidate: RTCIceCandidate }
        io.to(payload.target).emit('ice-candidate', payload);
    });

    // Handle Raise Hand
    socket.on('toggle-hand', (payload) => {
        // payload: { roomId: string, userId: string, raised: boolean }
        socket.to(payload.roomId).emit('hand-toggled', payload);
    });

    // Handle Chat Messages
    socket.on('send-message', (payload) => {
        // payload: { roomId, userId, message, time }
        // Broadcast to everyone in the room INCLUDING sender (simplified state management)
        // Or usually just to others, and sender adds locally. Let's broadcast to others.
        socket.to(payload.roomId).emit('receive-message', payload);
    });

    // Moderation: Kick User
    socket.on('kick-user', (payload) => {
        // payload: { targetUserId, roomId }
        io.to(payload.targetUserId).emit('kicked');
        socket.to(payload.roomId).emit('user-disconnected', payload.targetUserId); // Notify others to remove video
    });

    // Moderation: Mute User
    socket.on('mute-user', (payload) => {
        // payload: { targetUserId, roomId }
        io.to(payload.targetUserId).emit('muted-by-host');
    });

    // Reactions
    socket.on('send-reaction', (payload) => {
        // payload: { roomId, userId, emoji }
        socket.to(payload.roomId).emit('receive-reaction', payload);
    });
});

server.listen(PORT, () => {
    console.log(`Signaling server running on port ${PORT}`);
});
