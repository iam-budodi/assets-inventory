const { getRepository } = require('typeorm');
// const debug = require('debug')('srcServer: assetShared');
const { getUsernameFromToken } = require('./authUser')();

function assetShared() {
  async function getAllAssets(requestQuery) {
    const assetRepository = await getRepository('Asset');
    const { status, search } = requestQuery;

    const query = await assetRepository.createQueryBuilder('assets');

    if (status) {
      const stat = status.toUpperCase();
      query.andWhere('assets.assetStatus = :status', { status: stat });
    }
    if (search) {
      query.andWhere(
        '(assets.assetNumber LIKE :search OR assets.assetName LIKE :search OR assets.assetModel LIKE :search OR assets.assetLocation LIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async function getUserAssets(requestQuery, accessToken) {
    const userName = getUsernameFromToken(accessToken);
    const users = await getRepository('User')
      .find({ relations: ['assets'] });

    const user = users.filter(
      (asset) => asset.userName === userName,
    );

    const allAssets = await getAllAssets(requestQuery);
    const userAssets = allAssets.filter(
      (asset) => asset.employeeID === user[0].employeeID,
    );

    return userAssets;
  }

  return { getAllAssets, getUserAssets };
}

module.exports = assetShared;
