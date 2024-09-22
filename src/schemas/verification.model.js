import { DataTypes } from 'sequelize';

export { verificationModel };

function verificationModel(sequelize) {
  const attributes = {
    verifyWith: { type: DataTypes.STRING, allowNull: true },
    code: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM('SENDED', 'VERIFIED'), allowNull: false, defaultValue: 'SENDED' },
  };

  const options = {
    defaultScope: {
      attributes: {}
    },
    scopes: {
    }
  };

  return sequelize.define('Verification', attributes, options);
}