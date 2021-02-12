const { getConnection, getRepository } = require('typeorm');
const debug = require('debug')('srcServer: assetController');
const Asset = require('../entities/assetsEntity');
const { ASSETS, ASSET, ASSETS_PER_MEMBER } = require('../config/constants');
const { generateToken, getAudienceFromToken } = require('../helper/authCookie')();
const { getUsernameFromToken, isEmptyRequestBody } = require('../helper/authUser')();
const { getAllAssets, getUserAssets, getAssetById } = require('../helper/assetShared')();

function assetController() {
  async function getAssets(req, res) {
    const accessToken = req.headers.authorization.split(' ')[1];
    if (getAudienceFromToken(accessToken).includes(ASSETS)) {
      try {
        const assets = await getAllAssets(req.query);
        const token = await generateToken(accessToken, null);
        res.json({ assets, token });
      } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
        debug(error.message);
      }
    } else if (getAudienceFromToken(accessToken).includes(ASSETS_PER_MEMBER)) {
      try {
        const userAssets = await getUserAssets(accessToken);
        res.json({ userAssets, accessToken });
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

  async function getAssetFromUserId(req, res) {
    const accessToken = req.headers.authorization.split(' ')[1];
    if (getAudienceFromToken(accessToken).includes(ASSETS)) {
      try {
        const asset = await getAssetById(req.params);
        const token = await generateToken(accessToken, null);
        debug(asset);
        if (!asset) {
          res.status(404);
          res.send({ message: 'No such asset', accessToken });
        } else {
          res.status(200);
          res.json({ asset, token });
        }
      } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
        debug(error.message);
      }
    } else if (getAudienceFromToken(accessToken).includes(ASSETS_PER_MEMBER)) {
      try {
        const { id } = req.params;
        const userAssets = await getUserAssets(accessToken);
        const userAsset = userAssets.filter(
          (asset) => asset.assetNumber === +id,
        );

        if (userAsset.length === 0) {
          res.status(403);
          res.json({ message: 'You have no such asset', accessToken });
        } else {
          res.status(200);
          res.json({ userAsset: userAsset[0], accessToken });
        }
      } catch (error) {
        res.status(500);
        res.send('Internal Server Error');
        debug(error.message);
      }
    } else {
      res.status(404);
      res.send({ message: 'Not authorized to view this asset', accessToken });
    }
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
        const user = await getRepository('User')
          .createQueryBuilder('users')
          .leftJoinAndSelect('users.assets', 'assets')
          .where('users.userName = :userName', { userName })
          .getOne();

        const { employeeID } = user;
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
        debug(user);
        asset.employeeID = employeeID;
        debug(asset);

        await getRepository('Asset')
          .createQueryBuilder('assets')
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

  // async function middleware(req, res, next) {
  //   try {
  //     const assetRepository = await getRepository('Asset');
  //     const { id } = req.params;

  //     const query = await assetRepository.createQueryBuilder('assets');
  //     const asset = await query.where('assets.assetNumber = :assetNumber',
  //       { assetNumber: id }).getOne();

  //     if (!asset) {
  //       res.status(404);
  //       res.send('Not Found');
  //     }
  //     req.asset = asset;
  //     next();
  //   } catch (error) {
  //     debug(error.message);
  //   }
  // }

  return {
    getAssets, getAssetFromUserId, createAsset, updateAsset, deleteAsset,
  };
}

module.exports = assetController;
