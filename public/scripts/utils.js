const utils = {
  renderChannels: (channelList) => {
    channelList.forEach((channel) => {
      const li = document.createElement('li');
      li.classList.add('channel__li');
      const a = document.createElement('a');
      a.href = `../channels/${channel._id}`;
      a.innerHTML = `#${channel.name}`;
      li.appendChild(a);
      channels.appendChild(li);
    });
  },

  renderUsers: (users) => {
    console.log('in renderUsers')
    console.log('RU users are' + users)
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
      a.href = `../channels/startDM/${user._id}`;
      a.innerHTML = user.name;
      li.appendChild(a);
      usersUl.appendChild(li);
    });
  },

  renderOnlineUserStatus: (socketUsers) => {
    console.log('in renderOnlineUserStatus')
    console.log('ROUS socketUsers are:')
    console.log(socketUsers)

    let arrayOfSocketUsers = Object.entries(socketUsers).map(element => element[1])
    console.log(arrayOfSocketUsers)
    arrayOfSocketUsers.forEach((user) => {
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
  },

  removeOnlineStatusFrom: (diconnectedUserId) => {
    console.log('in removeOnlineStatusFrom')
    console.log('ROSF diconnectedUserId is' + diconnectedUserId)
    const onlineSpan = document.getElementById(diconnectedUserId + 'online');
    onlineSpan.remove();
  },

  makeFormattedTimeStamp: () => {
    const date_options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateObj = new Date();
    const date = dateObj.toLocaleDateString('en-gb', date_options);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes() < 10 ? '0' : '' + dateObj.getMinutes();
    return `on ${date} at ${hours}:${minutes}:`;
  },

  renderPost: (post) => {
    const li = document.createElement('li');
    li.classList.add('channel__li');
    const bySpan = document.createElement('span');
    bySpan.innerHTML = `By ${post.byName} ${utils.makeFormattedTimeStamp()}`;
    li.appendChild(bySpan);
    const contentP = document.createElement('p');
    contentP.innerHTML = post.content;
    li.appendChild(contentP);
    posts.appendChild(li);
  },
};
