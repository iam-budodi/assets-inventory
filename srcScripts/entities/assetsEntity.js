const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Asset',
  tableName: 'assets',
  columns: {
    assetNumber: {
      primary: true,
      type: 'int',
      generated: true,
    },
    assetName: {
      type: 'nvarchar',
      length: 100,
    },
    assetModel: {
      type: 'nvarchar',
      length: 25,
    },
    assetManufactureDate: {
      type: 'date',
      nullable: true,
    },
    assetCommissionedDate: {
      type: 'date',
      nullable: true,
    },
    assetPrice: {
      type: 'money',
    },
    assetStatus: {
      type: 'nvarchar',
      length: 100,
    },
    assetLocation: {
      type: 'nvarchar',
      length: 30,
    },
    assetCustodian: {
      type: 'nvarchar',
      length: 60,
    },
    employeeID: { // in case it fails to populate uncomment this
      type: 'int',
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      eager: true,
      // joinColumn: true,
      joinColumn: {
        name: 'employeeID', referencedColumnName: 'employeeID',
      },
    },

    // users: {
    //   type: 'many-to-one',
    //   target: 'User',
    //   eager: true,
    //   inverseSide: 'assets',
    // },
  },
});
