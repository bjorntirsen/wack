const Post = require('../models/post');

module.exports = (io) => {
  function getChannelName(socketReferer) {
    return socketReferer.split('/').slice(-1)[0];
  }
  const socketUsers = {};

  io.on('connection', (socket) => {
    socket.on('userDataFromClient', (userId, userName) => {
      const channelName = getChannelName(socket.handshake.headers.referer);
      socketUsers[socket.id] = { userId, userName, channelName };
      socket.leaveAll();
      socket.join(channelName);
      io.emit('socketUsersUpdated', socketUsers);
    });

    socket.on('postSaved', (newPost) => {
      Post.findById(newPost._id)
        .populate('by')
        .exec((err, post) => {
          if (err) return console.log(err);
          io.to(getChannelName(socket.handshake.headers.referer)).emit(
            'postFromServer',
            post
          );
        });
    });

    socket.on('disconnect', () => {
      if (socketUsers && socketUsers[socket.id]) {
        delete socketUsers[socket.id];
        io.emit('socketUsersUpdated', socketUsers);
      }
    });
  });
};
