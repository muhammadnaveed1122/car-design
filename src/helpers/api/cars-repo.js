import { createFakeBidderProfile } from '@/constants/data';
import { Sequelize } from 'sequelize';
import { db } from './db';

export const carsRepo = {
    getAll,
    getAllCusmtoer,
    getAllPendingCars,
    getMakesCount,
    getById,
    getBySlug,
    create,
    update,
    delete: _delete,
    filter,
    uniqueValues,
    carsOnSale,
    demoCars,
    updateSteps,
    getLatestByActivities,
    updateTrash,
    getAllTrashedCustomer,
    duplicateCar,
    updateWinBox
};


async function getAllPendingCars({ page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize;
    const result = await db.Car.findAndCountAll({
        where: { isPending: true },
        limit: pageSize,
        offset: offset
    });
    const totalUsers = result.count;
    const totalPages = Math.ceil(totalUsers / pageSize);

    return {
        totalCustomerPerPage: result.rows.length,
        totalPages: totalPages,
        currentPage: page,
        cars: result.rows
    };
}

async function updateBidEnded() {
    const Op = Sequelize.Op;
    const now = new Date();
    const endedCars = await db.Car.findAll({
        where: {
            status: { [Op.in]: ["NEW", "LIVE"] },
            bidDeadline: { [Op.not]: null },
            bidDeadline: { [Op.lt]: now },
        },
    });
    endedCars.forEach(async (car) => {
        Object.assign(car, { status: "ENDED" });
        const salePrice = car.price * 0.95

        if (car.bidderId && car.bidPrice >= salePrice) {
            const user = await db.User.findOne({ where: { id: car.bidderId } });

            Object.assign(user, {
                buyCount: user.get('buyCount') + 1,
                inPurchase: true,
            });

            const activity = await db.Activity.findOne({ where: { CarId: car.id } })
            Object.assign(activity, { type: "BUY" })

            await activity.save();
            Object.assign(car, { bidPrice: car.bidPrice, winBox: true });
            await user.save();
        }
        await car.save();

    });
}

async function getAll() {
    await updateBidEnded();
    return await db.Car.findAll({
        include: db.User,
        order: [['createdAt', 'DESC']], // Orders by 'createdAt' in descending order
    });
}
async function getAllCusmtoer({ search = "", page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize;
    const result = await db.Car.findAndCountAll({
        include: [
            {
                model: db.Activity,
                where: {
                    type: 'BUY',
                },
                required: true,
            },
            {
                model: db.User,
                required: true
            },
        ],
        where: { isTrash: false },
        order: [[Sequelize.literal('(SELECT MAX(`updatedAt`) FROM `Activities` WHERE `CarId` = `Car`.`id` AND `type` = "BUY")'), 'DESC']],
        limit: pageSize,
        offset: offset
    });
    const totalUsers = result.count;
    const totalPages = Math.ceil(totalUsers / pageSize);

    return {
        totalCustomerPerPage: result.rows.length,
        totalPages: totalPages,
        currentPage: page,
        customer: result.rows
    };
}

async function getMakesCount() {
    return await db.Car.findAll({
        group: ['make'],
        attributes: ['make', [Sequelize.fn('count', Sequelize.col('id')), 'makes_count']]
    });
}

async function getById(id) {
    await updateBidEnded();

    return await db.Car.findByPk(id, {
        include: [{
            model: db.User
        }, {
            model: db.Activity,
            include: db.User,
        }]
    });
}
async function getBySlug(slug) {
    await updateBidEnded();
    await updateAutoBid(slug)

    return await db.Car.findOne({
        where: {
            slug: slug,
            isPending: false
        },
        include: [{
            model: db.User
        }, {
            model: db.Activity,
            include: db.User,
            order: [['createdAt', 'DESC']], // Sort Activity in descending order by createdAt

        }]
    });
}
async function getLatestByActivities(id) {
    await updateBidEnded();
    return await db.Activity.findOne({
        where: {
            userId: id,
            type: 'BUY'
        },
        include: [{
            model: db.Car,
            required: true
        }],
        order: [['updatedAt', 'DESC']] // Assuming there's a createdAt column indicating the timestamp of the activity
    });
}

async function create(params) {

    const car = new db.Car(params);

    // save car
    await car.save();

    return car.get('id');
}

async function update(id, params) {
    await updateBidEnded();

    const car = await db.Car.findByPk(id);

    // validate
    if (!car) throw 'Car not found';

    const prevStatus = car.status;
    const activities = await db.Activity.findAll({
        where: {
            CarId: id
        }
    });
    const init = car.bidPrice == car.initialBidPrice
    prevStatus.status !== "LIVE" && params.status === "LIVE" && params.autoBid == null && (params.autoBid = createFakeBidderProfile(params.bidPrice, init))

    // Check if prevStatus is 'ENDED' or 'PAID' and params.status is 'LIVE'
    if ((prevStatus === 'ENDED' || prevStatus === 'PAID') && (params.status === 'LIVE' || params.status === 'NEW')) {

        if (activities.length > 0) {
            for (const activity of activities) {
                await activity.destroy();
            }

            params.bidderId = null
            params.bidPrice = params.initialBidPrice
            params.bidCount = 0
            params.purchaseSteps = 0
            const bidder = await db.User.findByPk(car.bidderId);
            bidder.inPurchase = false
            await bidder.save();
        }
    }
    Object.assign(car, params);

    if (prevStatus === 'ENDED' && params.status === 'PAID') {
        const bidder = await db.User.findByPk(car.bidderId);
        Object.assign(bidder, {
            spent: parseInt(bidder.get('spent')) + parseInt(car.get('bidPrice'))
        });
        await bidder.save();
    }

    await car.save();
}

async function _delete(id) {
    if (id === 0) return;
    const car = await db.Car.findByPk(id);
    if (!car) throw 'Car not found';

    // Check if car has a user and update inPurchase to false
    if (car.bidderId != null) {

        const user = await db.User.findOne(
            {
                where: {
                    id: car.bidderId
                }
            });
        if (user) {
            // Update inPurchase to false
            user.inPurchase = false;
            Object.assign(user, user);
            await user.save();
        }
    }
    // delete car
    await car.destroy();
}

async function filter(params) {
    await updateBidEnded();

    const {
        search, offset, limit,
        orderBy, increment,
        makes, yearFrom, yearTo,
        mileageFrom, mileageTo,
        priceFrom, priceTo,
        target, status,
    } = params;
    const order = [[orderBy, increment === true ? 'desc' : 'asc']];

    const Op = Sequelize.Op;
    return await db.Car.findAndCountAll({
        include: db.User,
        where: {
            [Op.or]: [
                {
                    year: parseInt(search) || 0,
                },
                {
                    make: { [Op.substring]: search },
                },
                {
                    model: { [Op.substring]: search },
                },
                {
                    vin: { [Op.substring]: search },
                }
            ],
            make: makes ? { [Op.in]: makes } : { [Op.not]: null },
            year: (yearFrom && yearTo) ? { [Op.between]: [parseInt(yearFrom) || 0, parseInt(yearTo) || 3000] } : { [Op.not]: null },
            mileage: (mileageFrom && mileageTo) ? { [Op.between]: [mileageFrom, mileageTo] } : { [Op.not]: null },
            price: (priceFrom && priceTo) ? { [Op.between]: [priceFrom, priceTo] } : { [Op.not]: null },
            referal: target === true ? { [Op.not]: null } : null,
            status: status ? status : { [Op.not]: null },
        },
        order,
        offset,
        limit,
    });
}

async function uniqueValues(params) {
    const { columns } = params;

    const Op = Sequelize.Op;
    return await db.Car.findAll({
        attributes: columns,
        group: columns,
    });
}

async function carsOnSale(params) {
    const { bidderId } = params;

    await updateBidEnded();
    const Op = Sequelize.Op;
    return await db.Car.findAll({
        include: db.User,
        where: {
            bidderId,
            status: { [Op.in]: ['ENDED', 'PAID'] },
        },
        order: [['status', 'asc']],
    });
}

async function demoCars(params) {
    const { id, referal } = params;

    await updateBidEnded();

    if (!id) {
        return await db.Car.findAll({
            include: db.User,
            where: {
                referal: null,
                status: 'LIVE',
                isPending: false,
            },
            group: ['vin'],
        });
    }

    let cars = await db.Car.findAll({
        include: db.User,
        where: {
            referal: null,
            status: 'LIVE',
            isPending: false,
        },
        order: [['updatedAt', 'DESC']],
    });

    if (referal) {
        let targetCars = await db.Car.findAll({
            include: db.User,
            where: {
                referal,
                status: 'LIVE',
                isPending: false,
            },
            order: [['updatedAt', 'DESC']],
        });

        cars = [...cars, ...targetCars]
    }
    return cars;
}

async function updateSteps(id, params) {
    const car = await db.Car.findByPk(id);

    // validate
    if (!car) throw 'Car not found';

    if (params.hasOwnProperty('purchaseSteps')) {
        car.purchaseSteps = params.purchaseSteps;
    }

    Object.assign(car, params);

    await car.save();
}

async function updateTrash(id) {
    const car = await db.Car.findByPk(id);
    if (!car) {
        throw 'Car not found';
    }

    // Assuming `isTrash` is a boolean field in the User model
    car.isTrash = !car.isTrash;

    // Save the changes to the database
    await car.save();
}

async function getAllTrashedCustomer({ search = "", page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize;
    await updateBidEnded();
    const result = await db.Car.findAndCountAll({
        include: [
            {
                model: db.Activity,
                required: true,
                where: {
                    type: 'BUY',
                },
            },
            {
                model: db.User,
                required: true
            },
        ],
        where: { isTrash: true },
        order: [[Sequelize.literal('(SELECT MAX(`updatedAt`) FROM `Activities` WHERE `CarId` = `Car`.`id` AND `type` = "BUY")'), 'DESC']],

        limit: pageSize,
        offset: offset
    });
    const totalUsers = result.count;
    const totalPages = Math.ceil(totalUsers / pageSize);

    return {
        totalCustomerPerPage: result.rows.length,
        totalPages: totalPages,
        currentPage: page,
        customer: result.rows
    };
}

async function duplicateCar(params) {
    await updateBidEnded();
    const car = new db.Car(params);

    // save car
    await car.save();

    return car.get('id');
}

async function updateWinBox(id) {
    await updateBidEnded();

    const car = await db.Car.findByPk(id);

    // validate
    if (!car) throw 'Car not found';

    Object.assign(car, { winBox: false });
    await car.save();
}

async function updateAutoBid(slug) {
    const result = await db.Car.findOne({
        include: [
            {
                model: db.Activity,
                where: {
                    type: 'BID',
                },
                required: true,
                order: [['updatedAt', 'DESC']],
                limit: 1
            }
        ],
        where: {
            slug: slug
        }

    });
    if (result?.Activities && result?.Activities.length > 0) {
        const { Activities } = result
        const { updatedAt, price } = Activities[0]
        console.log(Activities, "ActivitiesActivities", price)

        const autoBid = await generateFakeBid(result.price, updatedAt, result.autoBid, price)
        if (Object.keys(autoBid).length !== 0) {
            await db.Car.update({ autoBid: autoBid }, {
                where: {
                    slug: slug
                }
            });
        }

    }
}

const generateFakeBid = (price, lastBidTime, autoBid, bidPrice) => {
    const autobidPrice = price * 0.9; // 90% of the autobid price
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastBidTime;
    const totalLeftTime = 10 * 60 * 1000

    if (autoBid != null && Object.keys(autoBid).length !== 0) {
        return {};
    } else {
        if (bidPrice >= autobidPrice) {
            return {};
        }
        if (timeElapsed >= totalLeftTime && autoBid == null) {

            return createFakeBidderProfile(bidPrice, false);
        } else {
            return {}
        }
    }
};