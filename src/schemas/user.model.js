import { userRole, userStatus, packageModes } from '@/constants/data';
import { faker } from '@faker-js/faker';
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

export { userModel, fakeAdmin, fakeUser };

function userModel(sequelize) {

  const packMods = Object.values(packageModes);
  const attributes = {
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    hash: { type: DataTypes.STRING, allowNull: true },
    avatar: { type: DataTypes.STRING, allowNull: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    dateOfBirth: { type: DataTypes.DATE, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    zipCode: { type: DataTypes.STRING, allowNull: true },
    spent: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    buyCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    bidCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    packageMode: { type: DataTypes.ENUM(...packMods), allowNull: false, defaultValue: packMods[0] },
    image1: { type: DataTypes.STRING, allowNull: true },
    image2: { type: DataTypes.STRING, allowNull: true },
    referal: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.ENUM(...userRole), allowNull: false, defaultValue: userRole[0] },
    status: { type: DataTypes.ENUM(...userStatus), allowNull: false, defaultValue: userStatus[0] },
    inPurchase: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isTrash:{type:DataTypes.BOOLEAN,allowNull:false,defaultValue:false},
    displayName: { type: DataTypes.STRING, allowNull: true },
    hearAboutUs: { type: DataTypes.STRING, allowNull: true },
    companyName: { type: DataTypes.STRING, allowNull: true },
    companyNumber: { type: DataTypes.STRING, allowNull: true },
    vatNumber: { type: DataTypes.STRING, allowNull: true },
    companyWebsite: { type: DataTypes.STRING, allowNull: true },
  };

  const options = {
    defaultScope: {
      // exclude password hash by default
      attributes: { exclude: ['hash'] }
    },
    scopes: {
      // include hash with this scope
      withHash: { attributes: {}, }
    },
  };

  return sequelize.define('User', attributes, options);
}

function fakeAdmin() {
  const data = {
    firstName: (process.env.ADMIN_FIRSTNAME || 'admin'),
    lastName: (process.env.ADMIN_LASTNAME || 'manager'),
    email: (process.env.ADMIN_EMAIL || 'admin@manager.com'),
    phone: (process.env.ADMIN_PHONE || '+12312312312'),
    hash: bcrypt.hashSync((process.env.ADMIN_PASSWORD || 'horseman'), 10),
    role: 'ADMIN', referal: 'ALL', status: userStatus[2],
  };
  return data;
}

function fakeUser(index) {
  const avatar_index = index % 4;
  const data = {
    avatar: avatar_index === 0 ? null : `/assets/users/avatar-${avatar_index}.jpg`,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: `fake${index}@user.com`,
    phone: '000-000-0000',
    hash: bcrypt.hashSync('horseman', 10),
    role: userRole[0], status: userStatus[0],
  };
  return data;
}