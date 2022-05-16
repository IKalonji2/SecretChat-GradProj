const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const http = require('http');
const socketIO = require('socket.io');
// const socketHandler = require('./server/socket.js');    // Still to be implemented

const app = express();
const PORT = 3000;

const server = http.createServer(app);
const io = socketIO(server);

app.set('view engine', 'html');
app.engine('html', ejs.renderFile)
app.set('views', path.join(__dirname + '/client/views'));

app.use(bodyparser.json());
app.use(express.static(__dirname + '/client'));

io.on('connection', (socket) => {
  // socketHandler(socket, app);
});

const index = require('./server/src/index');
app.use('/', index);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})