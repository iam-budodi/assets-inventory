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
    './srcScripts/entities/**/*.js',
  ],
};
