const socket = io();

socket.on('socketUsersUpdated', utils.renderWhoIsOnline);

socket.on('postFromServer', utils.renderPost);

const useSocket = {
  emitUserData: () => {
    socket.emit('userDataFromClient', userId, userName);
  },
};
