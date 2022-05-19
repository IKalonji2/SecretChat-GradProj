window.addEventListener('DOMContentLoaded', script);

function script(e) {
  const socket = io(/*{ autoConnect: false }*/);
  const users = [];

  console.log('socket:',socket);
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  const initReactiveProperties = (user) => {
    console.log('USER:', user);
    user.connected = true;
    user.messages = [];
    user.hasNewMessages = false;
  };

  socket.on('user connected', (user) => {
      initReactiveProperties(user);
      users.push(user);
      console.log('USERS:', users);
  })

  socket.on('users', (users) => {
      console.log('USERS[SOCKER.ON("USERS")] BEFORE SORT', users);
      users.forEach((user) => {
          user.self = user.userID === socket.id;
          initReactiveProperties(user);
      });
      console.log('USERS[SOCKER.ON("USERS")] AFTER IRP', users);
      // put the current user first, and sort by username
      this.users = users.sort((a, b) => {
          if (a.self) return -1;
          if (b.self) return 1;
          if (a.userInfo.username < b.userInfo.username) return -1;
          return a.userInfo.username > b.userInfo.username ? 1 : 0;
      });
      console.log('USERS[SOCKER.ON("USERS")] AFTER SORT', users);
  });



  socket.on('connect-error', (err) => {
      if (err.message === 'invalid username') {
          //this.usernameSelected = false;
      }
  });
}