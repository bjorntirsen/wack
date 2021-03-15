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
    if (user.userName !== userName) {
      const item = document.createElement('a');
      item.textContent = `${user.userName}`;
      item.href = `channels/startPM/${user.userId}`
      item.className += 'btn';
      item.addEventListener('click', (e) => {
        socket.emit('startPM', user.userId);
      });
      users.appendChild(item);
    }
  });
});
