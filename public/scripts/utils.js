const utils = {
  renderChannels: (channelList) => {
    channelList.forEach((channel) => {
      const li = document.createElement('li');
      li.classList.add('channel__li');
      const a = document.createElement('a');
      a.href = `/channels/${channel._id}`;
      a.innerHTML = `#${channel.name}`;
      li.appendChild(a);
      channels.insertBefore(li, create);
    });
  },

  renderUsers: (users) => {
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
  },

  renderWhoIsOnline: (socketUsers) => {
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
        const onlineUser = document.getElementById(user.userId);
        onlineUser.appendChild(item);
      }
    });
  },

  formattedDate: () => {
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
  },

  renderPost: (post) => {
    const li = document.createElement('li');
    li.classList.add('channel__li');
    const bySpan = document.createElement('span');
    bySpan.innerHTML = `By ${post.by.name} ${utils.formattedDate()}`;
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
  },
};
