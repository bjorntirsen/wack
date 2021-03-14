const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const expressEjsLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const http = require('http').Server(app);
const io = require('socket.io')(http);

mongoose.connect('mongodb://localhost:27017/wack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const homeRouter = require('./routes/home');

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(expressEjsLayout);
app.use(
  session({
    secret: 'blablabla',
    resave: true,
    saveUninitialized: true,
    cookie: { expires: new Date(Date.now() + 30 * 86400 * 1000) },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);

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
  socket.on('userStatusChange', (userId, userName) => {
    const channelName = getChannelName(socket.handshake.headers.referer);
    const changedUser = {
      id: socket.id,
      userName,
      userId,
      channelName,
    };
    pushToArray(onlineUsers, changedUser);
    console.log(`${userName} entered ${channelName}`);
    console.log('online users:');
    console.log(onlineUsers);
    io.emit('usersStatusUpdate', onlineUsers);
  });

  socket.on('startPM', (PMuserId) => {
    console.log(PMuserId);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    onlineUsers.splice(
      onlineUsers.findIndex(({ id }) => id === socket.id),
      1
    );
    console.log('online users:');
    console.log(onlineUsers);
    socket.broadcast.emit('usersStatusUpdate', onlineUsers);
  });
});

http.listen(3000, () => {
  console.log('App running on port 3000');
});
