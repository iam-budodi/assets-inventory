const path = require('path');

module.exports = {
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: 'sa',
  password: 'B12js6dy$^',
  database: 'InventoryManagementDB',
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
  synchronize: true,
  logging: false,
  entities: [
    path.join(__dirname, '/srcScripts/entities/**/*.js'),
  ],
};
