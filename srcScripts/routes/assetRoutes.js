const express = require('express');
const assetController = require('../controllers/assetController');
const { verifyToken } = require('../helper/authCookie')();

const assetRouter = express.Router();

function assetRoute() {
  const {
    getAssets, getAssetById, createAsset, middleware, updateAsset, deleteAsset,
  } = assetController();

  assetRouter.use('/:id', middleware);

  assetRouter.route('/').get(verifyToken, getAssets);
  assetRouter.route('/:id').get(verifyToken, getAssetById);
  assetRouter.route('/').post(verifyToken, createAsset);
  assetRouter.route('/:id').put(verifyToken, updateAsset);
  assetRouter.route('/:id').delete(verifyToken, deleteAsset);

  return assetRouter;
}

module.exports = assetRoute;
