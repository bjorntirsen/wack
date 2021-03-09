const path = require('path');
const express = require('express');
const app = express();

const mongoose = require('mongoose');
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
const userRouter = require('./routes/user');

const Channel = require('./models/channel');
const Post = require('./models/post');

//Creating a http server
const http = require('http').Server(app);
//Setting up Socket.IO with the server
const io = require('socket.io')(http);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/user', userRouter);

io.on('connection', (socket) => {
  console.log('a user connected');
  io.emit('connection');
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('disconnected');
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('App running on port 3000');
});
