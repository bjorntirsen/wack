exports = module.exports = (io) => {
  function getChannelName(socketReferer) {
    return socketReferer.split('/').slice(-1)[0];
  }
  let socketUsers = {};

  io.on('connection', (socket) => {
    socket.on('userDataFromClient', (userId, userName) => {
      const channelName = getChannelName(socket.handshake.headers.referer);
      socketUsers[socket.id] = { userId, userName, channelName};
      socket.leaveAll();
      socket.join(channelName);
      io.emit('socketUsersFromServer', socketUsers);
      console.log('i just emitted this object')
      console.log(socketUsers)
    });

    socket.on('post', (post) => {
      io.to(post.to).emit('postFromServer', post);
    });

    socket.on('startPM', (PMuserId) => {
      console.log(PMuserId);
    });

    io.on('disconnect', () => {
      console.log('im gonna delete this user:')
      console.log(socketUsers[socket.id])
      io.emit('userOffline', socketUsers);
      delete socketUsers[socket.id];
    });
  });
};
