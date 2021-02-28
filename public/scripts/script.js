const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  posts.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('connection', () => {
  const item = document.createElement('li');
  item.textContent = 'User connected';
  users.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('disconnected', () => {
  const item = document.createElement('li');
  item.textContent = 'User disconnected';
  users.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
