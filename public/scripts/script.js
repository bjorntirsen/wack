const userId = document.getElementById('userId').value;
const userName = document.getElementById('userName').value;
const submit_btn = document.getElementById('submit_btn');
const socket = io();

function sendPostToServer() {
  const postContent = {
    content: document.getElementById('content').value,
  };
  socket.emit('post', { postContent });

  const channelId = window.location.href.split('/').slice(-1)[0];

  fetch(`/api/${channelId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postContent),
  })
    .then((response) => {})
    .then((data) => {
      console.log(data);
    });
}
if (document.getElementById('submit_btn') !== null) {
  document.getElementById('submit_btn').addEventListener('click', (e) => {
    e.preventDefault();
    sendPostToServer();
  });
}

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
