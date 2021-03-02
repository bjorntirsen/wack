//Core modules
const path = require('path');
const fs = require('fs');
//Third party module
const express = require('express');
const app = express();
//Creating a http server
const http = require('http').Server(app);
//Setting up Socket.IO with the server
const io = require('socket.io')(http);

//Setting up EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Setting up access to public folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Let express read json
app.use(express.json());

const channels = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/channel-list.json`)
);

const channels_content = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/channel-content.json`)
);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/home', (req, res) => {
  res.render('home', { channels });
});

app.get('/channels/create', (req, res) => {
  res.render('ch_create.ejs', {cssdir: '../'})
})

app.get('/channels/:id', (req, res) => {
  //const channel_data
  res.render('channels', { channels });
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

http.listen(3000, function () {
  console.log('App running on port 3000');
});
