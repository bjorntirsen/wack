const path = require('path');
const express = require('express');
const app = express();
const expressEjsLayout = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
require('./config/passport')(passport);
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('./socket')(io);

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

app.use(
  session({
    secret: 'blablabla',
    resave: true,
    saveUninitialized: true,
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

app.set('view engine', 'ejs');
app.use(expressEjsLayout);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

const indexRouter = require('./routes/indexRoutes');
const usersRouter = require('./routes/usersRoutes');
const channelsRouter = require('./routes/channelsRoutes');
const profileRouter = require('./routes/profileRoutes');
const apiRouter = require('./routes/apiRoutes');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/channels', channelsRouter);
app.use('/profile', profileRouter);
app.use('/api', apiRouter);

http.listen(3000, () => {
  console.log('App running on port 3000');
});
