const { getRepository } = require('typeorm');
// const debug = require('debug')('srcServer: assetShared');
const { getUsernameFromToken } = require('./authUser')();

function assetShared() {
  async function getAllAssets(requestQuery) {
    const { status, search } = requestQuery;
    const query = await getRepository('Asset')
      .createQueryBuilder('assets');

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

  async function getUserAssets(accessToken) {
    const userName = getUsernameFromToken(accessToken);

    const user = await getRepository('User')
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.assets', 'assets')
      .where('users.userName = :userName', { userName })
      .getOne();

    const { assets } = user;
    return assets;
  }

  async function getAssetById(requestParams) {
    const { id } = requestParams;

    const asset = await getRepository('Asset')
      .createQueryBuilder('assets')
      .where('assets.assetNumber = :assetNumber', { assetNumber: id })
      .getOne();

    return asset;
  }
  return { getAllAssets, getUserAssets, getAssetById };
}

module.exports = assetShared;
