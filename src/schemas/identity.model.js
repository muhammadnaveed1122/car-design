import { DataTypes } from "sequelize";
import { identityType } from "@/constants/data";

export { identityModel };

function identityModel(sequelize) {
  const attributes = {
    identityType: { type: DataTypes.ENUM(...identityType), allowNull: true },
    UserId: { type: DataTypes.STRING, allowNull: false },
    frontImage: { type: DataTypes.STRING, allowNull: true },
    backImage: { type: DataTypes.STRING, allowNull: true },
    approve: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  };
  const options = {
    defaultScope: {
      attributes: {},
    },
    scopes: {},
    indexes: [],
  };

  return sequelize.define("Identity", attributes, options);
}
