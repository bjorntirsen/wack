const userId = document.getElementById('userId').value;
const userName = document.getElementById('userName').value;
const socket = io();

socket.emit('userDataFromClient', userId, userName, (error) => {
  if (error) console.log(error);
});

function renderUserStatus(onlineUsers) {
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

socket.on('onlineUsersFromServer', (onlineUsers) => {
  renderUserStatus(onlineUsers);
});

socket.on('userOffline', (diconnectedUserId) => {
  console.log(diconnectedUserId)
  const onlineSpan = document.getElementById(diconnectedUserId + 'online');
  console.log(onlineSpan)
  onlineSpan.remove();
});
