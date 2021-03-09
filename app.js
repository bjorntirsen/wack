const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const expressEjsLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
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

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(expressEjsLayout);
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
