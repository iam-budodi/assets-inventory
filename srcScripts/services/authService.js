const { getRepository } = require('typeorm');

function authService() {
  async function getOneUser(username) {
    const users = await getRepository('User')
      .find({ relations: ['assets'] });

    const user = users.filter(
      (asset) => asset.userName === username,
    );

    return user;
  }

  return { getOneUser };
}

module.exports = authService;
