const { application } = require('express');
const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');

const app = express();

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('Welcome to my awesome movies app!');
});

app.get('/movies', (req, res) => {
  res.send('My Top 10 Movies!');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('What did you do!?');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
