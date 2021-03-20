const socket = io();

socket.on('socketUsersFromServer', utils.renderOnlineUserStatus);

socket.on('userOffline', utils.removeOnlineStatusFrom);

socket.on('postFromServer', utils.renderPost);

const useSocket = {
  emitUserData: () => {
    socket.emit('userDataFromClient', userId, userName);
  },

  emitPost: () => {
    socket.emit('post', {
      byId: userId,
      byName: userName,
      content: document.getElementById('content').value,
      to: channelId,
    });
  },
};
