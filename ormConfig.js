const path = require('path');

module.exports = {
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: +process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
  synchronize: process.env.TYPEORM_SYNCHRONIZE,
  logging: process.env.TYPEORM_LOGGING,
  entities: [
    path.join(__dirname, process.env.TYPEORM_ENTITIES),
  ],
};
