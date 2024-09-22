
import { db } from './db';

export const userCarRepo = {
    create,
    update,
    getAll,
    delete: _delete,
    getCarById,
    getUserCars: getCarByCreatorId,
    updateStatus: markCarAsSold,
    uniqueValues,
    getBySlug,
    getAllAuction,
    uniqueMarketValues
};

async function create(params) {
    const userC = new db.UserCar(params);
    const carResponse = await userC.save();
    if (carResponse) {
        const existingPackage = await db.Package.findOne({ where: { userId: params.creator, status: 1 } })
        const carRemainingCount =existingPackage ? existingPackage?.remainingCount - 1 : 0;
        if (existingPackage) {
            if (carRemainingCount == 0) {
                await db.Package.update({ status: 0, remainingCount: 0 },
                    {
                        where: {
                            userId: params.creator,
                            status: 1,
                        },
                    })
            }
        } else {
            await db.Package.update({ remainingCount: carRemainingCount },
                {
                    where: {
                        userId: params.creator,
                        status: 1,
                    },
                })
        }
    }


    return userC.get('id');
}

async function update(id, params) {
    const userCar = await db.UserCar.findByPk(id);
    console.log("🚀 ~ update ~ userCar:", userCar)
    // validate
    if (!userCar) throw 'Car not found';
    userCar.carDataJson = params
    userCar.isPending = true
    // Object.assign(userCar, params);
    await userCar.save();
}
async function uniqueValues(params) {
    const { columns } = params;

    return await db.UserCar.findAll({
        attributes: columns,
        group: columns,
    });
}

async function getAll() {
    return await db.UserCar.findAll({
        order: [['createdAt', 'DESC']], // Orders by 'createdAt' in descending order
    });
}

async function getCarById(userId,id) {
    return await db.UserCar.findOne({
        where: {
            id: id,           
            creator: userId   
        },
        include: {
            model: db.User,
            required: true,
        }
    });
}

async function _delete(id) {
    if (id === 0) return;
    const userCar = await db.UserCar.findByPk(id);
    if (!userCar) throw 'Car not found';
    // delete car
    await userCar.destroy();
}

async function getCarByCreatorId(id) {
    if (id === 0) return;
    const userCars = await db.UserCar.findAll({ where: { creator: id } });
    if (!userCars) throw 'Cars not found';
    return userCars
}


async function markCarAsSold(body) {
    const { status, id } = body
    const userCars = await db.UserCar.findByPk(id);
    if (!userCars) throw 'Cars not found';


    userCars.status = status;
    await userCars.save();
}
async function getBySlug(slug) {
    return await db.UserCar.findOne({
        where: {
            slug: slug,
            isPending: false
        }
    });
}

async function getAllAuction() {
    return await db.UserCar.findAll({
        where: {
            status: "LIVE",
            isPending: false
        },
        order: [['createdAt', 'DESC']], // Orders by 'createdAt' in descending order
    });
}

async function uniqueMarketValues(params) {
    const { columns } = params;

    return await db.UserCar.findAll({
        attributes: columns,
        group: columns,
        where: {
            status: "LIVE"
        }
    });
}