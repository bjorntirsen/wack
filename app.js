const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const expressEjsLayout = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('./server/socket')(io);

mongoose.connect('mongodb://localhost:27017/wack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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
app.use(
  fileUpload({
    createParentPath: true,
  })
);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const channelsRouter = require('./routes/channels');
const profileRouter = require('./routes/profile');
const apiRouter = require('./routes/api');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/channels', channelsRouter);
app.use('/profile', profileRouter);
app.use('/api', apiRouter);

http.listen(3000, () => {
  console.log('App running on port 3000');
});
