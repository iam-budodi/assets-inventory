const express = require('express');
const assetController = require('../controllers/assetController');

const assetRouter = express.Router();

function assetRoute() {
  const {
    getAssets, getAssetById, createAsset, middleware, updateAsset, deleteAsset,
  } = assetController();

  assetRouter.use('/:id', middleware);

  assetRouter.route('/').get(getAssets);
  assetRouter.route('/:id').get(getAssetById);
  assetRouter.route('/').post(createAsset);
  assetRouter.route('/:id').put(updateAsset);
  assetRouter.route('/:id').delete(deleteAsset);

  return assetRouter;
}

module.exports = assetRoute;
