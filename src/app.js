const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('views', './src/views');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
app.use(require('./routes/google.routes'));

module.exports = app;