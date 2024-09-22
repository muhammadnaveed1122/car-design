import CryptoJS from "crypto-js";
import { db } from "./db";

export const paymentRepo = {
  update,
  delete: _delete,
  create,
  getAllPayments,
  getById,
};

async function update(id, params) {
  const payment = await db.Payment.findByPk(id);

  // validate
  if (!payment) throw "payment not found";

  Object.assign(payment, params);

  await payment.save();
}

async function _delete(id) {
  const payment = await db.Payment.findByPk(id);
  if (!payment) throw "Payment account not found";

  // delete account
  await payment.destroy();
}

async function create(params) {
  const encryptedParams = {};

  for (const key in params) {
    if (Object.hasOwnProperty.call(params, key) && key !== "UserId") {
      try {
        encryptedParams[key] = CryptoJS.AES.encrypt(
          params[key],
          "payment"
        ).toString();
      } catch (error) {
        console.error("Error encrypting key:", key, error);
      }
    } else {
      encryptedParams[key] = params[key];
    }
  }

  const newPayment = new db.Payment(encryptedParams);
  await newPayment.save();

  return newPayment;
}

async function getAllPayments({ page = 1, pageSize = 10 }) {
  const offset = (page - 1) * pageSize;

  const result = await db.Payment.findAndCountAll({
    order: [["id", "DESC"]],
    limit: pageSize,
    offset: offset,
  });
  const decryptedRows = result.rows.map((row) =>
    decryptParams(row.dataValues, "payment")
  );
  const totalPaymentAccounts = result.count;
  const totalPages = Math.ceil(totalPaymentAccounts / pageSize);

  return {
    totalPaymentAccountsPerPage: result.rows.length,
    totalPages: totalPages,
    currentPage: page,
    paymentsAccounts: decryptedRows,
  };
}

function decryptParams(encryptedParams, secretKey) {
  const decryptedParams = {};
  Object.keys(encryptedParams).forEach((key) => {
    const obj = ["createdAt", "updatedAt", "id", "UserId"];
    try {
      console.log(!obj.includes(key), key);
      if (!obj.includes(key)) {
        const bytes = CryptoJS.AES.decrypt(encryptedParams[key], secretKey);
        decryptedParams[key] = bytes.toString(CryptoJS.enc.Utf8);
      } else {
        decryptedParams[key] = encryptedParams[key];
      }
    } catch (error) {
      decryptedParams[key] = encryptedParams[key];
    }
  });
  return decryptedParams;
}

async function getById(id) {
  const payment = await db.Payment.findOne({ where: { UserId: id } });
  if (!payment) {
    throw "verification account not found";
  }
  const decryptedRows = decryptParams(payment.dataValues, "payment");
  return decryptedRows;
}
