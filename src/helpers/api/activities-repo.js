import { db } from './db';

export const activitiesRepo = {
    bid,
    buy,
    activeAuctions,
};

async function bid(params) {

    const { userId, carId, price, } = params;

    const user = await db.User.findOne({ where: { id: userId } });
    const car = await db.Car.findOne({ where: { id: carId } });
    car.fakeName=null;
    if (!car || !user) {
        throw 'Car/User not found';
    }
    if (car.status != "LIVE") {
        throw "Can't bid for that car";
    }
    if (car.bidPrice > price) {
        throw "Can't bid in that low price";
    }
    const salePrice = car.price * 0.95
    if (price >= salePrice) {
        let activity = await db.Activity.findOne({
            where: {
                UserId: userId,
                CarId: carId,
                type: 'BID'
            }
        });
        if (!activity) {
            activity = new db.Activity({
                UserId: userId,
                CarId: carId,
                type: 'BUY'
            });
        }
        Object.assign(activity, {
            price,
            type: "BUY"
        });
        Object.assign(user, {
            buyCount: user.get('buyCount') + 1,
            inPurchase: true,
        });
        Object.assign(car, {
            bidPrice: price, winBox: true,
            status: "ENDED", bidderId: userId,
            autoBid: null
        });
        // save car
        await user.save();
        await car.save();
        // save activity
        await activity.save();
        return true
    } else {
        Object.assign(user, {
            bidCount: user.get('bidCount') + 1
        });

        Object.assign(car, {
            bidderId: userId,
            bidPrice: price,
            bidCount: car.get('bidCount') + 1,
            autoBid: null
        });

        // save car
        await user.save();
        await car.save();

        let activity = await db.Activity.findOne({
            where: {
                UserId: userId,
                CarId: carId,
                type: 'BID'
            }
        });
        if (!activity) {
            activity = new db.Activity({
                UserId: userId,
                CarId: carId,
                type: 'BID'
            });
        }
        Object.assign(activity, {
            price,
            bidCount: activity.get("bidCount") + 1
        });

        // save activity
        await activity.save();
        return false
    }
}

async function buy(params) {

    const { userId, carId, } = params;

    const user = await db.User.findOne({ where: { id: userId } });
    const car = await db.Car.findOne({ where: { id: carId } });
    if (!car || !user) {
        throw 'Car/User not found';
    }
    if (car.status != "LIVE") {
        throw "Can't bid for that car";
    }
    if (car.bidPrice >= car.price) {
        throw "Can't buy in that price";
    }

    let activity = await db.Activity.findOne({
        where: {
            CarId: carId,
            type: 'BUY'
        }
    });
    if (activity) {
        const buyerId = activity.get('userId');
        return { message: 'Already sold!', buyerId };
    }

    activity = new db.Activity({
        UserId: userId,
        CarId: carId,
        price: car.price,
        type: 'BUY'
    });

    await activity.save();

    Object.assign(user, {
        buyCount: user.get('buyCount') + 1,
        inPurchase: true
    });
    Object.assign(car, {
        bidderId: userId,
        bidPrice: car.get('price'),
        winBox: true,
        status: 'ENDED'
    });

    // save car
    await user.save();
    await car.save();

    return { message: 'You bought it!' };
}

async function activeAuctions(params) {

    const { userId } = params;

    return await db.Activity.findAll({
        include: {
            model: db.Car,
            include: db.User
        },
        where: {
            UserId: userId,
            type: "bid",
            "$Car.status$": "LIVE",
        },
    });
}