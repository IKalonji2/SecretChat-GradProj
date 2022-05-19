const  express = require('express');
const router = express.Router();

module.exports = router;

// Tests
const users = [
  { user: { username: 'Lebus', imageUrl: 'https://randomuser.me/api/portraits/men/9.jpg', hasNewMessages: true } },
  { user: { username: 'Lebus', imageUrl: 'https://randomuser.me/api/portraits/men/9.jpg', hasNewMessages: true } },
  { user: { username: 'Lebus', imageUrl: 'https://randomuser.me/api/portraits/men/9.jpg', hasNewMessages: true } },
  { user: { username: 'Lebus', imageUrl: 'https://randomuser.me/api/portraits/men/9.jpg', hasNewMessages: true } },
  { user: { username: 'Lebus', imageUrl: 'https://randomuser.me/api/portraits/men/9.jpg', hasNewMessages: true } },
  { user: { username: 'Lebus', imageUrl: 'https://randomuser.me/api/portraits/men/9.jpg', hasNewMessages: true } },
  { user: { username: 'Lebus', imageUrl: 'https://randomuser.me/api/portraits/men/9.jpg', hasNewMessages: true } },
  { user: { username: 'Lebus', imageUrl: 'https://randomuser.me/api/portraits/men/9.jpg', hasNewMessages: true } },
  { user: { username: 'Lebus', imageUrl: 'https://randomuser.me/api/portraits/men/9.jpg', hasNewMessages: true } },
  { user: { username: 'Lebus', imageUrl: 'https://randomuser.me/api/portraits/men/9.jpg', hasNewMessages: true } },
  { user: { username: 'Lebus', imageUrl: 'https://randomuser.me/api/portraits/men/9.jpg', hasNewMessages: true } },
];

const messages = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut'
];

const recipient = { username: 'Rover', imageUrl: 'https://randomuser.me/api/portraits/men/9.jpg', online: true, messages  }

router.all('/', (req, res) => {
  res.render('pages/index', { recipient, users, messages });
});