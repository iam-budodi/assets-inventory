const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();

function authRoute() {
  const { signUp, signIn, getUsers } = authController();

  authRouter.route('/signup').post(signUp);
  authRouter.route('/signin').post(signIn);
  authRouter.route('/users').get(getUsers);

  return authRouter;
}

module.exports = authRoute;
