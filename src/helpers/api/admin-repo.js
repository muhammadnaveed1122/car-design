import { Sequelize } from 'sequelize';
import { db } from './db';

export const adminRepo = {
    getAll,
};


async function getAll({ search = "", page = 1, pageSize = 10 }) {
    const Op = Sequelize.Op;
    const offset = (page - 1) * pageSize;

    const result = await db.User.findAndCountAll({
        where: {
            [Op.and]: [
                {
                    [Op.or]: [
                        { firstName: { [Op.substring]: search } },
                        { lastName: { [Op.substring]: search } }
                    ]
                },
                { role: 'SUBADMIN' }, // Condition to filter by role 'user'
            ]
        }, order: [
            ['id', 'DESC'] // Ordering by ID in descending order
        ],
        limit: pageSize,
        offset: offset
    });

    const totalUsers = result.count;
    const totalPages = Math.ceil(totalUsers / pageSize);

    return {
        totalAdminPerPage: result.rows.length,
        totalPages: totalPages,
        currentPage: page,
        admins: result.rows
    };
}