const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken } = require('../helper/authCookie')();

const authRouter = express.Router();

function authRoute() {
  const {
    signUp, signIn, signOut, getUsers, getUserById,
  } = authController();

  authRouter.route('/login').post(signIn);
  authRouter.route('/signup').post(verifyToken, signUp);
  authRouter.route('/logout').get(verifyToken, signOut);
  authRouter.route('/users').get(verifyToken, getUsers);
  authRouter.route('/users/:id').get(verifyToken, getUserById);

  return authRouter;
}

module.exports = authRoute;
