const userId = document.getElementById('userId').value;
const userName = document.getElementById('userName').value;
const socket = io();

function renderOnlineUserStatus(onlineUsers) {
  onlineUsers.forEach((user) => {
    let onlineId = user.userId + 'online';
    if (document.getElementById(onlineId) === null) {
      const item = document.createElement('span');
      item.textContent = 'online';
      if (user.userId === userId) {
        item.textContent += ' (you)';
      }
      item.id = user.userId + 'online';
      const onlineUser = document.getElementById(user.userId);
      onlineUser.appendChild(item);
    }
  });
}

function removeOnlineStatusFrom(diconnectedUserId) {
  const onlineSpan = document.getElementById(diconnectedUserId + 'online');
  console.log(onlineSpan);
  onlineSpan.remove();
}

socket.emit('userDataFromClient', userId, userName, (error) => {
  if (error) console.log(error);
});

socket.on('onlineUsersFromServer', (onlineUsers) => {
  renderOnlineUserStatus(onlineUsers);
});

socket.on('userOffline', (diconnectedUserId) => {
  removeOnlineStatusFrom(diconnectedUserId);
});
