const { getRepository } = require('typeorm');

function authService() {
  async function getOneUser(requestParams) {
    const { id } = requestParams;

    const user = await getRepository('User')
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.assets', 'assets')
      .where('users.employeeID = :employeeID', { employeeID: id })
      .getOne();

    return user;
  }

  return { getOneUser };
}

module.exports = authService;
