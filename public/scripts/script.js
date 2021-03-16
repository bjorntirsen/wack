const userId = document.getElementById('userId').value;
const userName = document.getElementById('userName').value;
const socket = io();

socket.emit('userDataFromClient', userId, userName, (error) => {
  if (error) console.log(error);
});

function updateWhoIsOnline(onlineUsers) {
  usersOnlineUl.textContent = '';
  onlineUsers.forEach((user) => {
    if (user.userId !== userId) {
      const item = document.createElement('a');
      item.textContent = `${user.userName}`;
      item.href = `channels/startPM/${user.userId}`;
      item.id = user.userId + 'online';
      item.className += 'btn';
      item.addEventListener('click', (e) => {
        socket.emit('startPM', user.userId);
      });
      usersOnlineUl.appendChild(item);
      const onlineUser = document.getElementById(user.userId);
      //console.log('onlineUSer' +onlineUser);
      offlineUsers.removeChild(onlineUser);
    }
  });
};

socket.on('onlineUsersFromServer', (onlineUsers) => {
  updateWhoIsOnline(onlineUsers);
});
