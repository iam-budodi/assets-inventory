const { getRepository } = require('typeorm');
const jwt = require('jsonwebtoken');
const debug = require('debug')('srcServer: authToken');
const { JWT_OPTIONS } = require('../config/constants');
const { getUsernameFromToken } = require('./authUser')();

function authToken() {
  const secretOrKey = process.env.SECRET;

  async function generateToken(requestToken, username) {
    const userName = username || getUsernameFromToken(requestToken);
    let accessToken;
    try {
      const user = await getRepository('User').find({ userName });
      // const { firstName, role } = user[0];
      const options = {
        algorithm: process.env.ALGORITHM,
        expiresIn: process.env.EXPIRY,
        issuer: process.env.ISSUER,
        subject: user[0].userName,
        audience:
        user[0].role === 'admin'
          ? JWT_OPTIONS.ADMIN_AUDIENCE
          : JWT_OPTIONS.MEMBER_AUDIENCE,
      };

      accessToken = jwt.sign({}, secretOrKey, options);
    } catch (error) {
      debug(error);
    }
    return accessToken;
  }

  function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
      res.status(401);
      res.json({ message: 'Unauthorized attempt' });
    } else {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        res.status(401);
        res.json({ message: 'Unauthorized attempt' });
      } else {
        jwt.verify(token, secretOrKey, (err) => {
          if (err) {
            res.status(401);
            res.json('Please login again');
          } else {
            next();
          }
        });
      }
    }
  }

  function getAudienceFromToken(token) {
    const { aud } = jwt.decode(token);
    return aud;
  }

  return { generateToken, verifyToken, getAudienceFromToken };
}

module.exports = authToken;
