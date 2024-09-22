import { db } from './db';

export const accountsRepo = {
    update,
    delete: _delete,
    create,
    getAllAccounts,
    getAllActiveAccounts
};

async function update(id, params) {
    const account = await db.Account.findByPk(id);

    // validate
    if (!account) throw 'Account not found';

    Object.assign(account, params);

    await account.save();
}

async function _delete(id) {
    const account = await db.Account.findByPk(id);
    if (!account) throw 'Account not found';

    // delete account
    await account.destroy();
}

async function create(params) {
    const newAccount = new db.Account(params);
    // save car
    await newAccount.save();

    return newAccount
}
async function getAllAccounts({ page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize;

    const result = await db.Account.findAndCountAll({
        order: [
            ['id', 'DESC']
        ],
        limit: pageSize,
        offset: offset
    });

    const totalAccounts = result.count;
    const totalPages = Math.ceil(totalAccounts / pageSize);

    return {
        totalAccountsPerPage: result.rows.length,
        totalPages: totalPages,
        currentPage: page,
        accounts: result.rows
    };
}

async function getAllActiveAccounts() {
    const result = await db.Account.findAndCountAll({
        where: {
            isActive: true
        },
        order: [
            ['id', 'DESC']
        ],
    });

    return {
        accounts: result.rows
    };
}