const { getRepository } = require('typeorm');
// const jwt = require('jsonwebtoken');
const debug = require('debug')('srcServer: authController');
const User = require('../entities/usersEntity');
const { USERS, SIGNUP } = require('../config/constants');
const { getUsernameFromToken } = require('../helper/authUser')();
const { getOneUser } = require('../services/authService')();
const { generateToken, getAudienceFromToken } = require('../helper/authCookie')();
const {
  generateSalt, hashPassword, passwordStrength, validatePassword, isEmptyRequestBody,
} = require('../helper/authUser')();

function authController() {
  async function signUp(req, res) {
    const userRepository = await getRepository('User');
    const accessToken = req.headers.authorization.split(' ')[1];

    if (isEmptyRequestBody(req.body) >= 5 && getAudienceFromToken(accessToken).includes(SIGNUP)) {
      const {
        firstName, lastName, userName, password, role,
      } = req.body;

      try {
        const user = userRepository.create(User);
        // TODO: consider using uuid library to generate and store employeeID
        if (await passwordStrength(password)) {
          user.firstName = firstName;
          user.lastName = lastName;
          user.userName = userName;
          user.role = role;
          user.salt = await generateSalt();
          user.password = await hashPassword(password, user.salt);
          await userRepository.save(user);
          const token = await generateToken(accessToken, null);

          res.status(201);
          res.json({ message: 'New user added', token });
          if (res.status(201)) debug('user signed up successful');
        } else {
          res.send({ message: 'Weak password' });
        }
      } catch (error) {
        if (error.number === 2627) {
          res.status(409);
          res.send('Username already exists.');
        } else {
          res.sendStatus(500);
        }
      }
    } else if (isEmptyRequestBody(req.body) === 0) {
      res.status(400);
      res.send({
        message: 'User can\'t be an empty object, please try again',
        accessToken,
      });
    } else if (isEmptyRequestBody(req.body) < 5) {
      res.status(400);
      res.send({
        message: 'User object is missing some information, please check and try again',
        accessToken,
      });
    } else {
      res.status(403);
      res.send({ message: 'Not authorized to create users', accessToken });
    }
  }

  async function signIn(req, res) {
    const base64Encoding = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Encoding, 'base64').toString().split(':');
    if (credentials.join('').length !== 0 && credentials[1].length !== 0) {
      const userName = credentials[0];
      const password = credentials[1];

      try {
        const user = await getRepository('User').findOne({ userName });

        if (user && (await validatePassword(password, user.password))) {
          const token = await generateToken(null, user.userName);
          res.status(200);
          res.json({ name: user.firstName, role: user.role, token });
        } else {
          res.status(401);
          res.json({ message: 'Invalid credentials, please check and try again' });
        }
      } catch (error) {
        if (credentials[0].length === 0) {
          res.status(401);
          res.json({ message: 'Please enter your username' });
        } else {
          res.status(500);
          res.json({ message: 'Internal Server Error' });
        }
      }
    } else if (credentials[0].length === 0) {
      res.status(401);
      res.json({ message: 'Please enter your username and password' });
    } else {
      res.status(401);
      res.json({ message: 'Please enter your password' });
    }
  }

  function signOut(req, res) {
    res.status(200);
    res.json({ message: 'Signed out' });
  }

  // NOTE: refer to the implementation here to limit access
  async function getUsers(req, res) {
    const accessToken = req.headers.authorization.split(' ')[1];
    if (getAudienceFromToken(accessToken).includes(USERS)) {
      try {
        const updatedUserList = [];
        const userRepository = await getRepository('User');
        const users = await userRepository.find({ relations: ['assets'] });
        debug(users);
        if (users) {
          users.forEach((user) => {
            updatedUserList.push({
              firstName: user.firstName,
              lastName: user.lastName,
              userName: user.userName,
              role: user.role,
              employeeID: user.employeeID,
              assets: user.assets,
            });
          });
          // assign cookie for user session
          const token = await generateToken(accessToken, null);
          res.status(200);
          res.json({ users: updatedUserList, token });
        } else {
          res.status(500);
          res.json({ message: 'Internal Server Error', accessToken });
        }
      } catch (error) {
        res.status(500);
        res.json({ message: 'Internal Server Error' });
        debug({
          errorMessage: error.message,
          errorDescription: 'Error retrieving users from database',
        });
      }
    } else {
      res.status(403);
      res.send({ message: 'Not authorized to view users', accessToken });
    }
  }

  async function getUserById(req, res) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const userName = getUsernameFromToken(accessToken);
    const user = await getOneUser(userName);
    debug(user);
  }

  return {
    signUp, signIn, signOut, getUsers, getUserById,
  };
}

module.exports = authController;
