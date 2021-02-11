const { getConnection, getRepository } = require('typeorm');
const debug = require('debug')('srcServer: assetController');
const Asset = require('../entities/assetsEntity');
const { ASSETS, ASSET, ASSETS_PER_MEMBER } = require('../config/constants');
const { generateToken, getAudienceFromToken } = require('../helper/authCookie')();
const { getUsernameFromToken, isEmptyRequestBody } = require('../helper/authUser')();
const { getAllAssets, getUserAssets } = require('../helper/assetShared')();

function assetController() {
  async function getAssets(req, res) {
    const accessToken = req.headers.authorization.split(' ')[1];
    if (getAudienceFromToken(accessToken).includes(ASSETS)) {
      try {
        res.json(await getAllAssets(req.query));
      } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
        debug(error.message);
      }
    } else if (getAudienceFromToken(accessToken).includes(ASSETS_PER_MEMBER)) {
      try {
        res.json(await getUserAssets(req.query, accessToken));
      } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
        debug(error.message);
      }
    } else {
      res.status(403);
      res.send({ message: 'Not authorized to view assets', accessToken });
    }
  }

  function getAssetById(req, res) {
    res.json(req.asset);
    // next();
  }

  async function createAsset(req, res) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const userName = getUsernameFromToken(accessToken);

    if (isEmptyRequestBody(req.body) >= 8 && getAudienceFromToken(accessToken).includes(ASSET)) {
      const {
        assetNumber,
        assetName,
        assetModel,
        assetManufactureDate,
        assetCommissionedDate,
        assetPrice,
        assetStatus,
        assetLocation,
        assetCustodian,
      } = req.body;

      try {
        const postQuery = await getRepository('Asset').createQueryBuilder('assets');
        // const { employeeID } = await getRepository('User')
        // .findOne({ userName, relations: ['assets'] });
        const users = await getRepository('User')
          .find({ relations: ['assets'] });

        const user = users.filter(
          (asset) => asset.userName === userName,
        );

        const { employeeID } = user[0];
        const token = await generateToken(accessToken, null);

        const asset = {
          assetNumber,
          assetName,
          assetModel,
          assetManufactureDate,
          assetCommissionedDate,
          assetPrice,
          assetStatus,
          assetLocation,
          assetCustodian,
        };

        asset.employeeID = employeeID;
        debug(asset);

        await postQuery
          .insert()
          .into(Asset)
          .values([asset])
          .execute();

        res.status(201);
        res.send({ message: `${asset.assetName} was successful added`, token });
      } catch (error) {
        debug(error.message);
        res.sendStatus(500);
      }
    } else if (isEmptyRequestBody(req.body) === 0) {
      res.status(400);
      res.send({
        message: 'Asset can\'t be an empty object, please try again',
        accessToken,
      });
    } else if (isEmptyRequestBody(req.body) < 8) {
      res.status(400);
      res.send({
        message: 'Asset object is missing some information, please check and try again',
        accessToken,
      });
    } else {
      res.status(403);
      res.send({ message: 'Not authorized to create assets', accessToken });
    }
  }

  async function updateAsset(req, res, next) {
    const { assetNumber } = req.asset;

    const updated = await getConnection()
      .createQueryBuilder()
      .update(Asset)
      .set(req.body)
      .where('assets.assetNumber = :assetNumber', { assetNumber })
      .execute();

    if (!updated) {
      res.sendStatus(500);
    }
    res.sendStatus(200);
    next();
  }

  async function deleteAsset(req, res) {
    const { assetNumber } = req.asset;

    const deleted = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Asset)
      .where('assets.assetNumber = :assetNumber', { assetNumber })
      .execute();

    if (!deleted) {
      res.sendStatus(500);
    }
    res.send(deleted);
  }

  async function middleware(req, res, next) {
    try {
      const assetRepository = await getRepository('Asset');
      const { id } = req.params;

      const query = await assetRepository.createQueryBuilder('assets');
      const asset = await query.where('assets.assetNumber = :assetNumber',
        { assetNumber: id }).getOne();

      if (!asset) {
        res.status(404);
        res.send('Not Found');
      }
      req.asset = asset;
      next();
    } catch (error) {
      debug(error.message);
    }
  }

  return {
    getAssets, getAssetById, createAsset, middleware, updateAsset, deleteAsset,
  };
}

module.exports = assetController;
