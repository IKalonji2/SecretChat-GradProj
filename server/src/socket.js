// import 

const { v4: uuidv4 } = require('uuid');

/*
 user model
 {
   id: uuid,
   name: 'str',
   image: 'urlstr',
   online: bool
 }

 // Don't store any form of description or dates, unless it's a message
 // Don't ever send the user id to the front, use a token instead
 // A token is like a user id but specifically 

 message model
 {
   userID: 'uuid', // Ommit from the client
   token: 'uuid',
   message: 'str',
   attachments: [files...{n}],
   dateCreated: timestamp
 }

 file model
 {
   id:x 'uuid',
   name: 'str'
   url: 'urlstr',
   type: 'str'
 }

 chat model
 {
   users: [id...{n}],
   messages: msg
 }

 id model
 {
   userid: 'uuid',
   token: 'uuid'
 }


*/

module.exports = {
  auth(socket, next) {
    console.log('SOCKET', socket.id);
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error('invalid username'));
    }
    socket.userInfo = {
        username: socket.handshake.auth.username,
        usernameSelected: socket.handshake.auth.usernameSelected,
        publicKey: socket.handshake.auth.publicKey
    };
    next();
  },
  socketHandler(socket, app, io) {
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

    console.log();

    // forward the private message to the right recipient
    socket.on('private message', ({ content, to, date }) => {
      console.log("TO", to);
      console.log(`message from ${socket.id} to ${to.userID} saying \"${content}\"`)
      socket.to(to.userID).emit('private message', {
        content,
        from: socket.id,
        date
      });
    });

    // notify users upon disconnection
    socket.on('disconnect', () => {
        socket.broadcast.emit('user disconnected', socket.id);
    });
  }
};