const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    employeeID: {
      primary: true,
      type: 'int',
      generated: true,
    },
    firstName: {
      type: 'nvarchar',
      length: 60,
    },
    lastName: {
      type: 'nvarchar',
      length: 60,
    },
    userName: {
      type: 'nvarchar',
      nullable: false,
      unique: true,
    },
    password: {
      type: 'nvarchar',
      nullable: false,
    },
    salt: {
      type: 'nvarchar',
      nullable: false,
    },
  },

});
