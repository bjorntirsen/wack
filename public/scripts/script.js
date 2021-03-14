const socket = io();
const userId = document.getElementById('userId').value;
const userName = document.getElementById('userName').value;

socket.emit('userStatusChange', userId, userName, (error) => {
  if (error) console.log(error);
});

socket.on('usersStatusUpdate', (onlineUsers) => {
  console.log(onlineUsers);
  users.textContent = '';
  onlineUsers.forEach((user) => {
    const item = document.createElement('li');
    item.textContent = `${user.userName}`;
    if (user.userName === userName) item.textContent += '(me)';
    else {
      item.className += 'btn';
      item.addEventListener('click', (e) => {
        socket.emit('startPM', user.userId);
      });
    }
    users.appendChild(item);
  });
});
