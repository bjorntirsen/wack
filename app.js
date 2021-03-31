const path = require('path');
const express = require('express');
const expressEjsLayout = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
require('./controllers/passportController')(passport);
const http = require('http');
const compression = require('compression');

const app = express();
const io = require('socket.io')(http);
require('./controllers/socketController')(io);

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
app.use(compression());

const indexRouter = require('./routes/indexRoutes');
const usersRouter = require('./routes/usersRoutes');
const channelsRouter = require('./routes/channelsRoutes');
const apiRouter = require('./routes/apiRoutes');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/channels', channelsRouter);
app.use('/api', apiRouter);
