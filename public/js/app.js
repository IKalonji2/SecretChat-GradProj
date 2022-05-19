window.addEventListener('DOMContentLoaded', script);

function script(e) {
  console.log('hello');
  const chatForm = document.getElementById('chat-form');
  const attachment = document.getElementById('attachment');
  const emoticons = document.getElementById('emoticons');

  chatForm.addEventListener('submit', onSendMessage);
  attachment.addEventListener('click', onAttachment);
  emoticons.addEventListener('click', onEmoticons);
}

function onUsernameSelection(event) {
  event.preventDefault();
  let username = document.getElementById('username').value;
  socket.auth = { username, usernameSelected: true }
  socket.connect();
}

function onEmoticons(event) {
  event.preventDefault();
  alert('Attachment Pressed');
}

function onAttachment(event) {
  event.preventDefault();
  alert('Emoticons Pressed');
}

function onSendMessage(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formProps = Object.fromEntries(formData);
  alert(formProps['input-message']);
}