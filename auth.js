const jwtSecret = 'why_so_serious'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken');

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username, // This is the username encoding in the JWT
    expiresIn: '7d',
    algorithm: 'HS256' // This is the algorithm used to "sign" or encode the values of the JWT
  });
}

// POST login
module.exports = (router) => {
  router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required'
      });
    }

    // Authenticate the user and generate a JWT if the credentials are valid
    // Replace this with your own user authentication logic
    if (username === 'test' && password === 'test') {
      const user = {
        id: 1,
        username: 'test'
      };
      const token = generateJWTToken(user);
      return res.json({ user, token });
    } else {
      return res.status(401).json({
        message: "Dave's not here! No such user."
      });
    }
  });
};
