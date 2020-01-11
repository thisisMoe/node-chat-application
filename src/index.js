const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicDirPath));

let count = 0;

io.on('connection', (socket) => {
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', 'Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined in!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room),
        });

        callback();
    });

    socket.on('sendMessage', (msg, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', generateMessage(user.username, msg));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left the room!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
        }
    });

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
        //Using google maps api to show user location
        io.to(user.room).emit(
            'locationMessage',
            generateLocationMessage(user.username, `https://google.com/maps?q=${coords.lat},${coords.long}`),
        );
        callback();
    });

    // socket.emit('countUpdated', count);

    // socket.on('increment', () => {
    //     count++;
    //     io.emit('countUpdated', count);
    // });
});

server.listen(port, () => {
    console.log('Server is up and running on port 3000');
});
