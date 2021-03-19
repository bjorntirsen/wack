const useApi = {
  fetchChannels: () => {
    fetch('/api/channels', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        utils.renderChannels(data);
      });
  },

  fetchUsers: () => {
    fetch('/api/users', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        utils.renderUsers(data);
      });
  },

  sendPostToServer: () => {
    const postBody = { content: document.getElementById('content').value };
    fetch(`/api/channels/${channelId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  },
};
