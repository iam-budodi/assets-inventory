require('reflect-metadata');
require('dotenv').config({ path: '../srcScripts/config/.env' });
const express = require('express');
const { createConnection } = require('typeorm');
const debug = require('debug')('srcServer');
const morgan = require('morgan');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
createConnection();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const assetRouter = require('../srcScripts/routes/assetRoutes')();
const authRouter = require('../srcScripts/routes/authRoutes')();

app.use('/api/assets', assetRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send({ message: 'hello world, guess the really learning is kicking off' });
});

app.listen(port, () => debug(chalk.yellow(`listening on http://localhost:${chalk.green(port)}`)));
