const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    employeeID: {
      primary: true,
      type: 'int',
      generated: 'increment',
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
    role: {
      type: 'nvarchar',
      nullable: false,
    },
    salt: {
      type: 'nvarchar',
      nullable: false,
    },
  },
  relations: {
    assets: {
      type: 'one-to-many',
      target: 'Asset',
      cascade: true,
      eager: false,
      inverseSide: 'user',
    },

    // assets: {
    //   name: 'user',
    //   target: 'User',
    //   type: 'one-to-many',
    //   eager: false,
    //   joinTable: {
    //     name: 'user_assets',
    //     joinColumn: {
    //       name: 'user_id',
    //     },
    //     inversJoinColumn: {
    //       name: 'asset_id',
    //     },
    //   },
    //   inverseSide: 'User',
    //   cascade: true,
    // },
  },

});

// relations: {
//   user: {
//     type: 'one-to-many',
//     target: 'User',
//     // eager: true,
//     joinColumn: {
//       name: 'userName',
//     },
//   },
// },
