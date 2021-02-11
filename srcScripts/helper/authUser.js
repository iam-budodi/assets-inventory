const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function authUser() {
  async function passwordStrength(password) {
    const regex = /((?=.{8,})(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    // return password.match(regex);
    return regex.test(password);
  }

  async function generateSalt() {
    return bcrypt.genSalt();
  }

  async function hashPassword(password, salt) {
    return bcrypt.hash(password, salt);
  }

  async function validatePassword(password, storedHashPassword) {
    return bcrypt.compare(password, storedHashPassword);
  }

  function getUsernameFromToken(token) {
    const { sub } = jwt.decode(token);
    return sub;
  }

  function isEmptyRequestBody(requestBody) {
    return Object.keys(requestBody).length;
  }

  return {
    passwordStrength,
    generateSalt,
    hashPassword,
    validatePassword,
    getUsernameFromToken,
    isEmptyRequestBody,
  };
}

module.exports = authUser;
