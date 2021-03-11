const socket = io();
const userId = document.getElementById('userId').value;
const userName = document.getElementById('userName').value;

const form = document.getElementById('form');
if (form != null) {
  const input = document.getElementById('input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });
}

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  posts.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('connection', () => {
  socket.emit('userStatusChange', userId);
  socket.emit('newUser', userName);
});

socket.on('newUser', (newUserName) => {
  if (newUserName != userName) {
    const item = document.createElement('li');
    item.textContent = `${newUserName} connected`;
    users.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
});

socket.on('disconnected', (userOffline) => {
  const item = document.createElement('li');
  item.textContent = `${userOffline} disconnected`;
  users.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});