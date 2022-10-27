const { User } = require('./models.js');

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  passportJWT = require('passport-jwt');

JWTStrategy = passportJWT.Strategy,
ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
  usernameField: 'Username',
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
      return callback(null, false, { message: 'Incorrect username or password. YOU SHALL NOT PASS!' });
    }

    if (!user.validatePassword(password)) {
      console.log('incorrect password. YOU SHALL NOT PASS!');
      return callback(null, false, { message: 'Incorrect password. YOU SHALL NOT PASS!' });
    }

    console.log('finished');
    return callback(null, user);
  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'why_so_serious'
}, (jwtPayload, callback) => {
  return User.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));