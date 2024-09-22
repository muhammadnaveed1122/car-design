import CryptoJS from "crypto-js";
import { db } from "./db";

export const identityRepo = {
  update,
  delete: _delete,
  create,
  List,
  getById,
};

async function update(id, params) {
  const identityData = await db.Identity.findByPk(id);

  // validate
  if (!identityData) throw "identity account not found";

  Object.assign(identityData, params);

  await identityData.save();
}

async function _delete(id) {
  const identityData = await db.Identity.findByPk(id);
  if (!identityData) throw " identity account not found";

  // delete account
  await identityData.destroy();
}

async function create(params) {
  const newIdentity = new db.Identity(params);
  await newIdentity.save();
  return newIdentity;
}

async function List({ page = 1, pageSize = 10 }) {
  const offset = (page - 1) * pageSize;

  const result = await db.Identity.findAndCountAll({
    order: [["id", "DESC"]],
    limit: pageSize,
    offset: offset,
  });

  const totalAccounts = result.count;
  const totalPages = Math.ceil(totalAccounts / pageSize);

  return {
    totalAccountsPerPage: result.rows.length,
    totalPages: totalPages,
    currentPage: page,
    accounts: result.rows,
  };
}

async function getById(id) {
  const identity = await db.Identity.findOne({ where: { UserId: id } });
  if (!identity) throw "identity account not found";
  return identity;
}
