const userId = document.getElementById('userId').value;
const userName = document.getElementById('userName').value;
const submit_btn = document.getElementById('submit_btn');
const channelId = window.location.href.split('/').slice(-1)[0];
const socket = io();

//Functions
function sendPostToServer() {
  const postBody = { content: document.getElementById('content').value };
  socket.emit('post', {
    byId: userId,
    byName: userName,
    content: document.getElementById('content').value,
    to: channelId,
  });

  fetch(`/api/${channelId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postBody),
  })
    .then(() => {})
    .then((data) => {
      console.log(data);
    });
}

function renderOnlineUserStatus(onlineUsers) {
  console.log(onlineUsers)
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
  onlineSpan.remove();
}

function makeFormattedTimeStamp() {
  const date_options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dateObj = new Date();
  const date = dateObj.toLocaleDateString('en-gb', date_options);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  return `on ${date} at ${hours}:${minutes}:`;
}

//Socket events and event listeners
socket.emit('userDataFromClient', userId, userName, (error) => {
  if (error) console.log(error);
});

socket.on('onlineUsersFromServer', (onlineUsers) => {
  renderOnlineUserStatus(onlineUsers);
});

socket.on('userOffline', (diconnectedUserId) => {
  removeOnlineStatusFrom(diconnectedUserId);
});

if (document.getElementById('submit_btn') !== null) {
  document.getElementById('submit_btn').addEventListener('click', (e) => {
    e.preventDefault();
    sendPostToServer();
  });
}

socket.on('postFromServer', (post) => {
  const li = document.createElement('li');
  li.classList.add('channel__li');
  const bySpan = document.createElement('span');
  bySpan.innerHTML = `By ${post.byName} ${makeFormattedTimeStamp()}`;
  li.appendChild(bySpan);
  const contentP = document.createElement('p');
  contentP.innerHTML = post.content;
  li.appendChild(contentP);
  posts.appendChild(li);
  document.getElementById('content').value = '';
});
