//Core modules
const path = require('path');
//Third party modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');

//Setup mongoose DB
mongoose.connect('mongodb://localhost:27017/wack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

//Creating a channel schema
const channelSchema = new mongoose.Schema({
  name: String,
  description: String,
  private: false,
  posts: [],
});
//And a method
channelSchema.methods.created = function () {
  const message = this.name
    ? 'Channel created: ' + this.name
    : "The channel doesn't have a name";
  console.log(message);
};
//Making a model of that schema
const Channel = mongoose.model('Channel', channelSchema);

//Creating a post schema
const postSchema = new mongoose.Schema({
  by: String,
  content: String,
  timestamp: {},
});
//And a method
postSchema.methods.created = function () {
  const message = this.name
    ? 'Post created: ' + this.name
    : "The post doesn't have a name";
  console.log(message);
};
//Making a model of that schema
const Post = mongoose.model('Post', postSchema);

//Creating a http server
const http = require('http').Server(app);
//Setting up Socket.IO with the server
const io = require('socket.io')(http);

//Setting up EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Setting up access to public folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Let express read html forms
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/home', async (req, res) => {
  let channels = [];
  await Channel.find((err, data) => {
    if (err) return console.error(err);
    channels = data;
  });
  res.render('home', { channels });
});

app.get('/channels/create', (req, res) => {
  res.render('ch_create.ejs', { cssdir: '../' });
});

app.post('/channels/create', (req, res) => {
  const channel = new Channel({
    name: req.body.name,
    description: req.body.description || '',
    private: req.body.private ? true : false,
  });
  channel.save((err) => {
    if (err) return console.error(err);
    channel.created();
  });
  res.redirect('/home');
});

app.get('/channels/:id', async (req, res) => {
  let channels = [];
  await Channel.find((err, data) => {
    if (err) return console.error(err);
    channels = data;
  });
  let channel = {};
  await Channel.findOne({ _id: req.params.id }, (err, data) => {
    if (err) return console.error(err);
    channel = data;
  });
  res.render('channel', { channel, channels, cssdir: '../' });
});

app.post('/channels/:id', async (req, res) => {
  const post = new Post({
    by: req.body.user,
    description: req.body.content || '',
    timestamp: new Date(),
  });
  await Channel.updateOne(
    { _id: req.params.id },
    { $push: { posts: post } }
  );
  let channels = [];
  await Channel.find((err, data) => {
    if (err) return console.error(err);
    channels = data;
  });
  let channel = {};
  await Channel.findOne({ _id: req.params.id }, (err, data) => {
    if (err) return console.error(err);
    channel = data;
  });
  console.log(post);
  console.log(channel)
  //res.render('channel', { channel, channels, cssdir: '../' });
  res.render(`channel`, { channel, channels, cssdir: '../' })
});

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
