import { createFakeBidderProfile } from '@/constants/data';
import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
    post: duplicate
});

async function duplicate(req, res) {
    let car = JSON.parse(req.body)
    const slug = `${car.make.replace(/\s/g, '')}-${car.model.replace(/\s/g, '')}-${car.year}-${genRanHex(5)}`;
    car.bidPrice = car.initialBidPrice
    car.slug = slug.toLowerCase()
    car.status ==="LIVE" && (car.autoBid = createFakeBidderProfile(car.bidPrice ,true))

    try {
        car.id = await carsRepo.duplicateCar(car);
    } catch (e) {
        res.status(500).json({ message: e });
    } finally {
        res.status(200).json(car);
    }
}
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');