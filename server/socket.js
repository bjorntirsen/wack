exports = module.exports = (io) => {
  //Keep track of online users
  function pushToArray(arr, obj) {
    const index = arr.findIndex((e) => e.id === obj.id);
    if (index === -1) arr.push(obj);
    else arr[index] = obj;
  }
  function getChannelName(socketReferer) {
    return socketReferer.split('/').slice(-1)[0];
  }
  let onlineUsers = [];

  io.on('connection', (socket) => {
    socket.on('userDataFromClient', (userId, userName) => {
      const channelName = getChannelName(socket.handshake.headers.referer);
      const changedUser = {
        socketId: socket.id,
        userName,
        userId,
        channelName,
      };
      onlineUsers.push(changedUser);
      //console.log(onlineUsers);
      socket.join(channelName);
      io.emit('onlineUsersFromServer', onlineUsers);
    });

    socket.on('startPM', (PMuserId) => {
      console.log(PMuserId);
    });

    socket.on('disconnect', () => {
      const diconnectedUser = onlineUsers.filter(
        (user) => user.socketId === socket.id
      );
      if (diconnectedUser !== undefined) {
        socket.broadcast.emit('userOffline', diconnectedUser[0].userId);
        onlineUsers.splice(
          onlineUsers.findIndex(({ id }) => id === socket.id),
          1
        );
      }
    });
  });
};
