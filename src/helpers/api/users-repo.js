import { userStatus } from "@/constants/data";
import { Sequelize } from "sequelize";
import getConfig from "next/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "./db";

const { serverRuntimeConfig } = getConfig();

export const usersRepo = {
  authenticate,
  resetPassword,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  updateUserPurchase,
  updateTrash,
  getAllTrashedUser,
  googleAuthenticate,
};

async function authenticate({ email, password }) {
  const user = await db.User.scope("withHash").findOne({ where: { email }, include: [{ model: db.Package, as: 'packages', where: { status: 1 },required:false }] });
  console.log("🚀 ~ authenticate ~ user:", user)

  if (!(user && (!password || bcrypt.compareSync(password, user.hash)))) {
    throw "Email or password is incorrect";
  }
  if (user.isTrash) {
    throw "This account is disabled by admin.";
  }

  if (user.role !== "USER" && user.role !== "SELLER" && user.role !== "TRADER") {
    throw "You do not have permission to access the admin panel.";
  }
  switch (user.status) {
    case userStatus[0]: {
      // pending
      throw "Your profile is not approved yet!";
      break;
    }
    case userStatus[1]: {
      // denied
      throw "You are forbidden to sign in";
      break;
    }
  }

  // create a jwt token that is valid for 7 days
  const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, {
    expiresIn: "7d",
  });

  // remove hash from return value
  const userJson = user.get();
  delete userJson.hash;

  // return user and jwt
  return {
    ...userJson,
    token,
  };
}

async function googleAuthenticate(params) {
  console.log(params,'params params params')
  let user = await db.User.scope("withHash").findOne({
    where: { email: params?.email },
  });

  if (!user) {
    const User = new db.User(params);
    if(!params?.loginType){
      User.packageMode = "TRIAL";
    }
    User.status = "APPROVED";
    user = await User.save();
  }

  if (user?.isTrash) {
    throw "This account is disabled by admin.";
  }
  switch (user?.status) {
    case userStatus[1]: {
      throw "You are forbidden to sign in";
      break;
    }
  }
  // create a jwt token that is valid for 7 days
  const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, {
    expiresIn: "7d",
  });
  // remove hash from return value
  const userJson = user.get();
  delete userJson.hash;

  // return user and jwt
  return {
    ...userJson,
    token,
  };
}
async function resetPassword({ email, phone, password }) {
  const user = await db.User.scope("withHash").findOne({
    where: { email, phone },
  });

  if (!user) {
    throw "Email or phone is incorrect";
  }

  user.hash = bcrypt.hashSync(password, 10);

  // save user
  await user.save();
}

async function getAll({ search = "", page = 1, pageSize = 10 }) {
  const Op = Sequelize.Op;
  const offset = (page - 1) * pageSize;

  const result = await db.User.findAndCountAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { firstName: { [Op.substring]: search } },
            { lastName: { [Op.substring]: search } },
          ],
        },
        { role: "user" }, // Condition to filter by role 'user'
        { isTrash: false },
      ],
    },
    order: [
      ["id", "DESC"], // Ordering by ID in descending order
    ],
    limit: pageSize,
    offset: offset,
  });

  const totalUsers = result.count;
  const totalPages = Math.ceil(totalUsers / pageSize);

  return {
    totalUsersPerPage: result.rows.length,
    totalPages: totalPages,
    currentPage: page,
    users: result.rows,
  };
}

async function updateUserPurchase(id, params) {
  const user = await db.User.findByPk(id);

  if (!user) throw "User not found";

  if (params.hasOwnProperty("inPurchase")) {
    user.inPurchase = params.inPurchase;
  }

  Object.assign(user, params);

  await user.save();
}

async function getById(id) {
  return await db.User.findByPk(id);
}

async function create(params, validate = false) {
  // validate
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw 'Email "' + params.email + '" is already taken';
  }
  if (validate === true) return;
  const user = new db.User(params);

  // hash password
  if (params.password) {
    user.hash = bcrypt.hashSync(params.password, 10);
  }

  // save user
  await user.save();
}

async function update(id, params) {
  console.log(params, "Pa€$w0rd!Pa€$w0rd!Pa€$w0rd!");
  const user = await db.User.scope("withHash").findByPk(id);

  // validate
  if (!user) throw "User not found";

  if (!params.hasOwnProperty("status") && !params.hasOwnProperty("referal")) {
    if (
      !(
        params.hasOwnProperty("curPassword") &&
        bcrypt.compareSync(params.curPassword, user.hash)
      )
    ) {
      throw "Current Password is incorrect";
    }

    if (params.hasOwnProperty("email")) {
      if (
        user.email !== params.email &&
        (await db.User.findOne({ where: { email: params.email } }))
      ) {
        throw 'Email "' + params.email + '" is already taken';
      }
    }

    if (params.hasOwnProperty("password")) {
      // hash password if it was entered
      if (params.password) {
        params.hash = bcrypt.hashSync(params.password, 10);
      }
    }
  }
  // copy params properties to user
  Object.assign(user, params);

  await user.save();
}

async function _delete(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";

  // delete user
  await user.destroy();
}

async function updateTrash(id) {
  const user = await db.User.findByPk(id);
  if (!user) {
    throw "User not found";
  }

  // Assuming `isTrash` is a boolean field in the User model
  user.isTrash = !user.isTrash;

  // Save the changes to the database
  await user.save();
}

async function getAllTrashedUser({ search = "", page = 1, pageSize = 10 }) {
  const Op = Sequelize.Op;
  const offset = (page - 1) * pageSize;

  const result = await db.User.findAndCountAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { firstName: { [Op.substring]: search } },
            { lastName: { [Op.substring]: search } },
          ],
        },
        { role: "user" }, // Condition to filter by role 'user'
        { isTrash: true },
      ],
    },
    order: [
      ["id", "DESC"], // Ordering by ID in descending order
    ],
    limit: pageSize,
    offset: offset,
  });

  const totalUsers = result.count;
  const totalPages = Math.ceil(totalUsers / pageSize);

  return {
    totalUsersPerPage: result.rows.length,
    totalPages: totalPages,
    currentPage: page,
    users: result.rows,
  };
}
