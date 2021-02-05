const { getConnection, getRepository } = require('typeorm');
const debug = require('debug')('srcServer: assetController');
const Asset = require('../entities/assetsEntity');

function assetController() {
  async function getAssets(req, res) {
    try {
      const assetRepository = await getRepository('Asset');
      const { status, search } = req.query;

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

      const assets = await query.getMany();
      if (!assets) {
        res.status(500);
        res.send('Internal Server Error');
      }
      res.json(assets);
    } catch (error) {
      debug(error.stack);
    }
  }

  function getAssetById(req, res, next) {
    res.json(req.asset);
    next();
  }

  async function createAsset(req, res) {
    if (!req.body.assetNumber) {
      res.status(400);
      res.send('Bad Request');
    }

    try {
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

      const assetRepository = await getRepository('Asset');
      const postQuery = await assetRepository.createQueryBuilder('assets');
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
      const result = await postQuery
        .insert()
        .into(Asset)
        .values([asset])
        .execute();

      if (!result) {
        res.sendStatus(400);
      }

      res.sendStatus(201);
      // res.json(result);
    } catch (error) {
      res.status(500);
      res.send('Internal Server Error');
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

// createConnection().then(async (connection) => {
//   const assetRepository = await connection.getRepository('Asset');
//   debug(assetRepository);

//   router.route('/assets')
//     .get(async (req, res) => {
//       const assets = await assetRepository.find();
//       res.json(assets);
//     });
// });
