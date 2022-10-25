const { User } = require('./models.js');

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./model.js'),
  passportJWT = require('passport-jwt');

JWTStrategy = passportJWT.Strategy,
ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
  usernameFieald: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  console.log(username + ' ' + password);
  User.findOne({ username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect username');
      return callback(null, false, { message: 'Incorrect username or password.' });
    }

    console.log('finished');
    return callback(null, user);
  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToke(),
  secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
  return User.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));