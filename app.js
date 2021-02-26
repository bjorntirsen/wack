const path = require('path');
const app = require('express')();

//Setting up EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, function () {
  console.log('App running on port 3000');
});
