const express = require('express');
const debug = require('debug')('srcServer');
const morgan = require('morgan');
require('reflect-metadata');

const app = express();

const port = process.env.PORT || 3000;

const router = express.Router();

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));

router.get('/', (req, res) => {
  res.send({ message: 'hello world, guess the really learning is kicking off' });
});

app.use('/api/', router);

app.listen(port, () => debug(`listening on http://localhost:${port}`));
