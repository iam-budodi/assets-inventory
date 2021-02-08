const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Employee',
  tableName: 'employees',
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
    age: {
      type: 'int',
      nullable: false,
    },
    emailAddress: {
      type: 'nvarchar',
      nullable: true,
    },
    phoneNumber: {
      type: 'int',
      nullable: false,
    },
    hiredDate: {
      type: 'date',
    },
    designation: {
      type: 'nvarchar',
      length: 30,
    },
    department: {
      type: 'nvarchar',
      length: 25,
    },
    employmentStatus: {
      type: 'nvarchar',
      length: 15,
    },
  },

});
