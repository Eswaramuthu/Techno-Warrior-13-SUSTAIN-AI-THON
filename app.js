// app.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const roomUsers = {};

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Route for home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected.');

  // When a client joins a room, assign them to that room
  socket.on('joinRoom', (roomName) => {
    // If the room already has 2 users, prevent further joins
    if (roomUsers[roomName] && roomUsers[roomName] >= 2) {
      socket.emit('roomFull', 'This room is full. Please try another room.');
      return;
    }

    // Increment the number of users in the room
    if (!roomUsers[roomName]) {
      roomUsers[roomName] = 0;
    }
    roomUsers[roomName]++;

    // Join the room
    socket.join(roomName);
    console.log(`User joined room: ${roomName}. Total users in room: ${roomUsers[roomName]}`);

    // Send a welcome message to the user who joined the room
    socket.emit('chatMessage', 'You have joined the room. Start chatting!');

    // Broadcast when someone joins the room
    socket.to(roomName).emit('chatMessage', 'A new user has joined the room.');
  });

  // Handle incoming chat messages and send them to the room
  socket.on('chatMessage', (message, roomName) => {
    // Emit message to all other users in the room, except the sender
    socket.to(roomName).emit('chatMessage', message);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected.');

    // Decrease the number of users in the room when a user disconnects
    for (const room in roomUsers) {
      if (roomUsers[room] > 0) {
        roomUsers[room]--;
        break;
      }
    }
  });
});
// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
