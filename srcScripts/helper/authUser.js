const bcrypt = require('bcrypt');

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

  return {
    passwordStrength, generateSalt, hashPassword, validatePassword,
  };
}

module.exports = authUser;
