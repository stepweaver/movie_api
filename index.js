const { User, Movie } = require('./models');

// Imports
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  fs = require('fs'),
  path = require('path'),
  cors = require('cors'),
  morgan = require('morgan'),
  mongoose = require('mongoose');

  const { check, validationResult } = require('express-validator');
  
  const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
  
  let allowedOrigins = ['http://localhost:8080', 'https://cthulhu8080.herokuapp.com/'];
  app.use(cors({
    origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = `The CORS policy for this application doesn't allow access from origin ` + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common', {stream: accessLogStream}));
app.use(express.static('public')),
app.get('/documentation', (req, res) => {
  res.sendFile('public/documenation.html', { root: __dirname });
});

// Allows Mongoose to connect to myFlixDB to perform CRUD operations
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const passport = require('passport');
require('./passport');

// CREATE
app.post('/users',
  [
    check('username', 'Username is required').isLength({ min: 5 }),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    
    let hashedPassword = User.hashPassword(req.body.password);
    User.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.username + ' already exists');
        } else {
          User
            .create({
              username: req.body.username,
              password: hashedPassword,
              email: req.body.email,
              birth: req.body.birth
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(404).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(404).send('Error: ' + error);
      });
  });

app.post('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOneAndUpdate({ username: req.params.username }, {
    $push: { favoriteMovies: req.params.MovieID }
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

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movie.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send('Error: ' + err);
    });
});

app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send('Error: ' + err);
    });
});

// app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
//   User.findOne({ username: req.params.username })
//     .then((user) => {
//       res.status(200).json(user);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(404).send('User not found.');
//     });
// });

app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movie.findOne({ title: req.params.title })
  if (Movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).send('Movie not found.');
  };
});

app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movie.findOne({ 'genre.name': req.params.name })
    .then((movie) => {
      res.status(200).json(movie.genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send('Genre not found.');
    });
});

app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movie.findOne({ 'movie.director': req.params.director })
    .then((movie) => {
      res.status(200).json(movie.director);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send('Director not found.');
    });
});

// UPDATE
app.put('/users/:username', passport.authenticate('jwt', { session: false }),
  [
    check('username', 'Username is required').isLength({ min: 5 }),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = User.hashPassword(req.body.password);
    User.findOneAndUpdate({ username: req.params.username }, {
    $set:
    {
      username: req.body.username,
      password: hashedPassword,
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
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.delete('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});