const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
// const ejs = require('ejs');
const { auth, socketHandler } = require('./server/src/socket.js');

const app = express();
const PORT = 4000;

const server = http.Server(app);
const io = socketIO(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/client/views'));

app.use(bodyparser.json());
// app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/public'));

io.use((socket, next) => {
  auth(socket, next);
});

io.on('connection', (socket) => {
  socketHandler(socket, app, io);
  console.log('trying to connect socket');
});

const index = require('./server/src/index');
app.use('/', index);

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});