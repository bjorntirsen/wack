//Global variables
const userId = document.getElementById('userId').value;
const userName = document.getElementById('userName').value;
const adminUser = document.getElementById('adminUser').value;
const submit_btn = document.getElementById('submit_btn');
const channelId = window.location.href.split('/').slice(-1)[0];

//API functions

const fetchChannels = () => {
  fetch('/api/channels', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      renderChannels(data);
    });
};

const fetchUsers = () => {
  fetch('/api/users', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      renderUsers(data);
    });
};

const sendPostToServer = () => {
  const postBody = {
    content: document.getElementById('content').value,
    by: userId,
  };
  fetch(`/api/channels/${channelId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postBody),
  })
    .then((res) => res.json())
    .then((newPost) => {
      socket.emit('postSaved', newPost);
    });
};

//Render functions

const renderChannels = (channelList) => {
  channelList.forEach((channel) => {
    const li = document.createElement('li');
    li.classList.add('channel__li');
    const a = document.createElement('a');
    a.href = `/channels/${channel._id}`;
    a.innerHTML = `#${channel.name}`;
    li.appendChild(a);
    channels.insertBefore(li, create);
  });
};

const renderUsers = (users) => {
  users.forEach((user) => {
    const li = document.createElement('li');
    li.classList.add('d-flex');
    li.id = user._id;
    const img = document.createElement('img');
    img.classList.add('icon_image');
    img.src = user.profilePhoto;
    img.alt = user.name;
    li.appendChild(img);
    const a = document.createElement('a');
    a.classList.add('user__li');
    a.href = `/channels/DMorProfile/${user._id}`;
    a.innerHTML = user.name;
    li.appendChild(a);
    usersUl.appendChild(li);
  });
};

const renderWhoIsOnline = (socketUsers) => {
  document.querySelectorAll('.onlineSpan').forEach((e) => e.remove());
  let arrayOfSocketUsers = Object.entries(socketUsers).map(
    (element) => element[1]
  );
  arrayOfSocketUsers.forEach((user) => {
    let onlineId = user.userId + 'online';
    if (document.getElementById(onlineId) === null) {
      const item = document.createElement('span');
      item.innerHTML = ' online';
      item.classList.add('onlineSpan');
      if (user.userId === userId) {
        item.innerHTML += ' (you)';
      }
      item.id = user.userId + 'online';
      if (document.getElementById(user.userId) !== null) {
        const onlineUser = document.getElementById(user.userId);
        onlineUser.appendChild(item);
      }
    }
  });
};

const formattedDate = () => {
  function addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }
  const date_options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dateObj = new Date();
  const date = dateObj.toLocaleDateString('en-gb', date_options);
  const hours = addZero(dateObj.getHours());
  const minutes = addZero(dateObj.getMinutes());
  return `on ${date} at ${hours}:${minutes}:`;
};

const renderPost = (post) => {
  const li = document.createElement('li');
  li.classList.add('channel__li');
  const bySpan = document.createElement('span');
  bySpan.innerHTML = `By ${post.by.name} ${formattedDate()}`;
  li.appendChild(bySpan);
  const contentP = document.createElement('p');
  contentP.innerHTML = post.content;
  li.appendChild(contentP);
  if (userId.toString() === post.by._id.toString() || adminUser === true) {
    const span = document.createElement('span');
    const aEdit = document.createElement('a');
    aEdit.href = `/channels/editPost/${post._id}`;
    aEdit.innerHTML = 'Edit';
    span.appendChild(aEdit);
    const aDelete = document.createElement('a');
    aDelete.href = `/channels/deletePost/${post._id}`;
    aDelete.innerHTML = 'Delete';
    span.appendChild(aDelete);
    li.appendChild(span);
  }
  posts.appendChild(li);
};

//Socket functions

const socket = io();

socket.on('socketUsersUpdated', renderWhoIsOnline);

socket.on('postFromServer', renderPost);

const emitUserData = () => {
  socket.emit('userDataFromClient', userId, userName);
};

//Event listeners

document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault();
  fetchChannels();
  fetchUsers();
  emitUserData();
});

if (document.getElementById('submit_btn') !== null) {
  document.getElementById('submit_btn').addEventListener('click', (e) => {
    e.preventDefault();
    sendPostToServer();
    document.getElementById('content').value = '';
  });
}

if (document.getElementById('profile_pic') !== null) {
  const profilePicInput = document.getElementById('profile_pic');
  const label = input.nextElementSibling;
  const labelVal = label.innerHTML;

  profilePicInput.addEventListener('change', (e) => {
    let fileName = '';
    fileName = e.target.value;

    if (fileName) label.innerHTML = fileName;
    else label.innerHTML = labelVal;
  });
}
