require('reflect-metadata');
const express = require('express');
const { createConnection } = require('typeorm');
const debug = require('debug')('srcServer');
const morgan = require('morgan');
const chalk = require('chalk');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
createConnection();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const assetRouter = require('../srcScripts/routes/assetRoutes')();

app.use('/api/assets', assetRouter);

app.get('/', (req, res) => {
  res.send({ message: 'hello world, guess the really learning is kicking off' });
});

app.listen(port, () => debug(chalk.yellow(`listening on http://localhost:${chalk.green(port)}`)));
