const { getRepository } = require('typeorm');
const debug = require('debug')('srcServer: authController');
const User = require('../entities/usersEntity');
const {
  generateSalt, hashPassword, passwordStrength, validatePassword,
} = require('../helper/authUser')();

function authController() {
  async function signUp(req, res) {
    const userRepository = await getRepository('User');
    const {
      firstName, lastName, userName, password,
    } = req.body;

    const user = userRepository.create(User);
    // TODO: consider using uuid library to generate and store employeeID
    if (await passwordStrength(password)) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.userName = userName;
      user.salt = await generateSalt();
      user.password = await hashPassword(password, user.salt);

      try {
        await userRepository.save(user);
        res.sendStatus(201);
        // res.json(user);
        if (res.status(201)) debug('user signed up successful');
      } catch (error) {
        if (error.number === 2627) {
          res.status(409);
          res.send('Username already exists.');
        } else {
          res.sendStatus(500);
        }
      }
    } else {
      res.send('Weak password');
    }
  }

  async function signIn(req, res) {
    const { userName, password } = req.body;
    try {
      const user = await getRepository('User').findOne({ userName });
      // TODO: find out a way to handle empty object from login request
      if (user && (await validatePassword(password, user.password))) {
        res.json(user.firstName);
      } else {
        res.status(401);
        res.json('Invalid credential');
      }
    } catch (error) {
      debug(error.message);
    }
  }

  async function getUsers(req, res) {
    try {
      const updatedUserList = [];
      const userRepository = await getRepository('User');
      const users = await userRepository.find();
      users.forEach((user) => {
        updatedUserList.push({
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          employeeID: user.employeeID,
        });
      });

      if (!updatedUserList) {
        res.sendStatus(500);
      }
      res.json(updatedUserList);
    } catch (error) {
      debug(error.message);
    }
  }

  return { signUp, signIn, getUsers };
}

module.exports = authController;
