const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
    response.render('pages/index', {
        usernameSelected: false,
    });
});

io.use((socket, next) => {
    console.log('SOCKET', socket.id);
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error('invalid username'));
    }
    socket.userInfo = {
        username: socket.handshake.auth.username,
        usernameSelected: socket.handshake.auth.usernameSelected,
    };
    next();
});

io.on('connection', (socket) => {
    // fetch existing users
    const users = [];
    for (let [id, socket] of io.of('/').sockets) {
        users.push({
            userID: id,
            userInfo: socket.userInfo,
        });
    }
    socket.emit('users', users);

    // notify existing users
    socket.broadcast.emit('user connected', {
        userID: socket.id,
        userInfo: socket.userInfo,
    });

    // forward the private message to the right recipient
    socket.on('private message', ({ content, to }) => {
        socket.to(to).emit('private message', {
            content,
            from: socket.id,
        });
    });

    // notify users upon disconnection
    socket.on('disconnect', () => {
        socket.broadcast.emit('user disconnected', socket.id);
    });
});

http.listen(8000, () => {
    console.log(`Server listening at http://localhost:${8000}`);
});
