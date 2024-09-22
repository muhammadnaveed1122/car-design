import { DataTypes } from 'sequelize';

export { activityModel };

function activityModel(sequelize) {
  const attributes = {
    price: { type: DataTypes.INTEGER, allowNull: false },
    bidCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    type: { type: DataTypes.ENUM('BID', 'BUY'), allowNull: false, defaultValue: 'BID' }
  };

  const options = {
    defaultScope: {
      attributes: {}
    },
    scopes: {
    },
    indexes: [
    ]
  };

  return sequelize.define('Activity', attributes, options);
}