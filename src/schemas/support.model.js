import { DataTypes } from 'sequelize';

export { supportModel };

function supportModel(sequelize) {
  const attributes = {
    name: { type: DataTypes.STRING, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false },
  };

  const options = {
    defaultScope: {
      attributes: {}
    },
    scopes: {
    }
  };

  return sequelize.define('Support', attributes, options);
}