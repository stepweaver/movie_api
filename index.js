const { User, Movie } = require('./models');

// Imports
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  fs = require('fs'),
  morgan = require('morgan'),
  mongoose = require('mongoose');


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));
app.use(express.static('public'));

// Allows Mongoose to connect to myFlixDB to perform CRUD operations
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// CREATE
app.post('/users', (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exits');
      } else {
        User
          .create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            birth: req.body.birth
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(404).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(404).send('Error: ' + error);
    });
});

app.post('/users/:username/movies/:MovieID', (req, res) => {
  User.findOneAndUpdate({ username: req.params.username }, {
    $addToSet: { favoriteMovies: req.params.MovieID }
  },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(404).send('Error: ' + err);
      } else {
        res.status(200).json(updatedUser);
      }
    });
});

// READ
app.get('/', (req, res) => {
  res.send('Welcome to MyFlix!');
});

app.get('/movies', (req, res) => {
  Movie.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send('Error: ' + err);
    });
});

app.get('/users', (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send('Error: ' + err);
    });
});

app.get('/users/:username', (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send('Error: ' + err);
    });
});

app.get('/movies/:title', (req, res) => {
  Movie.findOne({ title: req.params.title })
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send('Error: ' + err);
    });
});

app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.genre.name === genreName).genre;
  
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).send('Genre not found');
  }
});

app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.director.name === directorName).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).send('Director not found');
  }
});

// UPDATE
app.put('/users/:username', (req, res) => {
  User.findOneAndUpdate({ username: req.params.username }, {
    $set:
    {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      birth: req.body.birth
    }
  },
    { new: true }, // This line returns the updated document
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(404).send('Error: ' + err);
      } else {
        res.status(200).json(updatedUser);
      }
    });
});

// DELETE
app.delete('/users/:username', (req, res) => {
  User.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' has been deregistered');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send('Error: ' + err);
    });
});

app.delete('/users/:username/movies/:MovieID', (req, res) => {
  User.findOneAndUpdate({ username: req.params.username }, {
    $pull: { favoriteMovies: req.params.MovieID }
  },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(404).send('Error: ' + err);
      } else {
        res.status(200).send("Movie deleted from user's favoriteMovies");
      }
    });
});

// app.delete('/users/:id', (req, res) => {
//   const { id } = req.params;

//   let user = users.find(user => user.id == id);

//   if (user) {
//     users = users.filter(user => user.id != id);
//     res.status(200).send(`User ${id}, ${user.name}, has been deregistered`);
//   } else {
//     res.status(404).send('User not found');
//   }
// });

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });