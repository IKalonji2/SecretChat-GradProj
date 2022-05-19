window.addEventListener('DOMContentLoaded', script);
let users;
let myPrivateKey;
let myUser;
let socket;

function script(e) {
  socket = io({ autoConnect: false });
  users = ["dummy"];
  // Set up username and keys then connect
  (async () => {
    const username = prompt("Please enter a username");
    socket.auth = { username, usernameSelected: true };

    const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
      type: 'ecc', // Type of the key, defaults to ECC
      curve: 'curve25519', // ECC curve name, defaults to curve25519
      userIDs: [{ name: username }], // you can pass multiple user IDs
      format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    });

    myPrivateKey = privateKey;
    socket.auth.publicKey = publicKey;
    socket.connect();

    const usernameField = document.querySelector('div.user.profile > div.username').getElementsByTagName("p").item(0);
    usernameField.textContent = username;

  })();


  console.log('socket:', socket);
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
    console.log('USERS AFTER CONNECTION:', users);
  })

  socket.on('users', (newUsers) => {
    users = [];
    newUsers.forEach((user) => {
      if (user.userID === socket.id) {
        user.self = true;
        myUser = user;
        console.log("MY USER:", myUser);
      }
      initReactiveProperties(user);
      users.push(user);
    });

    users = users.filter(user => !user.self);
    users.unshift(myUser);

    console.log('USERS[SOCKER.ON("USERS")] AFTER MOVE', users);
  });

  socket.on("private message", async ({ content, from, date }) => {
    console.log(`message from ${from} saying \"${content}\"`);

    console.log("USERS SEARCHED FOR SENDER:", users);
    const sendingUser = users.find(user => user.userID === from);

    const privateKey = await openpgp.readKey({ armoredKey: myPrivateKey });
    const publicKey = await openpgp.readKey({ armoredKey: sendingUser.userInfo.publicKey });

    const message = await openpgp.readMessage({
      armoredMessage: content // parse armored message
    });

    const { data: decrypted, signatures } = await openpgp.decrypt({
      message,
      verificationKeys: publicKey,
      decryptionKeys: privateKey
    });

    console.log("MESSAGE:", decrypted);

    try {
      await signatures[0].verified; // throws on invalid signature
      console.log('Signature is valid');
    } catch (e) {
      throw new Error('Signature could not be verified: ' + e.message);
    }

    addMessageToDisplay(sendingUser, decrypted, date, false);

    console.log("RECHECK SENDING USER:", users.find(user => user.userID === from));
  });



  socket.on('connect-error', (err) => {
    console.log(err);
    if (err.message === 'invalid username') {
      usernameSelected = false;
    }
  });

  socket.on('user disconnected', (socketId) => {
    users = users.filter(user => user.userID !== socketId);
  });

  async function sendMessage(event) {
    event.preventDefault();
    //TODO: Get user from selected chat
    const receivingUserName = document.getElementById("recipient-username").innerText;
    console.log(receivingUserName);
    console.log(users);

    const receivingUser = users.find(user => user.userInfo.username === receivingUserName);
    console.log(receivingUser);

    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);

    const textMessage = formProps['input-message'];
    const publicKey = await openpgp.readKey({ armoredKey: receivingUser.userInfo.publicKey });
    const privateKey = await openpgp.readKey({ armoredKey: myPrivateKey });
    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: textMessage }), // input as Message object
        encryptionKeys: publicKey,
        signingKeys: privateKey
    });
    console.log(encrypted);
    let date = Date();

    socket.emit("private message", {
        content: encrypted,
        to: receivingUser,
        date
    });

    addMessageToDisplay(receivingUser, textMessage, date, true);

  } 

  function addMessageToDisplay(user, messageText, date, isFromSelf=false){
    user.messages.push({
        content: messageText,
        fromSelf: isFromSelf,
        date
    });
    const messagesDiv = document.getElementsByClassName("messages").item(0);
    const messageElement = document.createElement("div");
  
    if(isFromSelf) 
        messageElement.setAttribute("class", "user-messages");
    else {
        user.hasNewMessages = true;
        messageElement.setAttribute("class", "recipient-messages");
    }
    const messagePara = document.createElement("p");
    const messageContentNode = document.createTextNode(messageText);
  
    messagePara.appendChild(messageContentNode);
    messageElement.appendChild(messagePara);
    messagesDiv.appendChild(messageElement);
  }

  
  const chatForm = document.getElementById('chat-form');
  chatForm.addEventListener('submit', sendMessage);
}