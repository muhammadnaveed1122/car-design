import {
  userModel,
  fakeAdmin,
  fakeUser,
  carModel,
  fakeCar,
  verificationModel,
  supportModel,
  accountModel,
  paymentModel,
  identityModel,
  userCarsModel,
  packageModel
} from "@/schemas";
import { activityModel } from "@/schemas/activity.model";
import { Sequelize } from "sequelize";
import getConfig from "next/config";
import mysql from "mysql2/promise";


const { serverRuntimeConfig } = getConfig();

let initialized = false;

// initialize db and models, called on first api request from /helpers/api/api-handler.js
const initialize = async () => {
  // create db if it doesn't already exist
  const { host, port, user, password, database } = serverRuntimeConfig.dbConfig;

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // connect to db
  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });

  // init models and add them to the exported db object
  db.User = userModel(sequelize);
  db.Car = carModel(sequelize);
  db.Identity = identityModel(sequelize);
  db.Verification = verificationModel(sequelize);
  db.Activity = activityModel(sequelize);
  db.Support = supportModel(sequelize);
  db.Account = accountModel(sequelize);
  db.Payment = paymentModel(sequelize);
  db.UserCar = userCarsModel(sequelize);
  db.Package=packageModel(sequelize);
  db.Activity.belongsTo(db.User);
  db.Activity.belongsTo(db.Car);

  db.Car.belongsTo(db.User, {
    foreignKey: "bidderId",
  });
  db.Identity.belongsTo(db.User, {
    foreignKey: "UserId",
  });
  db.UserCar.belongsTo(db.User, {
    foreignKey:"creator"
  })
  db.User.hasMany(db.Package,{ as: 'packages' });
  db.User.hasMany(db.Activity);
  db.Car.hasMany(db.Activity);

  db.User.hasOne(db.Car);

  // sync all models with database
  // await sequelize.sync({ alter: true });

  await _initDefaultDB(true);

  initialized = true;
  connection.end();
};

export const db = {
  initialize,
};

export { initialized };
const _initDefaultDB = async (onlyAdmin = false) => {
  let adminUser = await db.User.findOne({ where: { role: "ADMIN" } });
  if (!adminUser) {
    console.log("Initialize Admin User");

    adminUser = new db.User(fakeAdmin());

    // save adminUser
    await adminUser.save();

    if (onlyAdmin === true) return;

    await generateUsers();
    await generateCars();
  }
};

const generateUsers = async (count = 5) => {
  for (let i = 1; i <= count; ++i) {
    let user = new db.User(fakeUser(i));

    await user.save();
  }
};

const generateCars = async (ranCount = 50, tarCount = 30) => {
  for (let i = 0; i < ranCount; ++i) {
    const car = new db.Car(fakeCar());
    await car.save();
  }
  for (let i = 0; i < tarCount; ++i) {
    const car = new db.Car(fakeCar(true));
    await car.save();
  }
};
