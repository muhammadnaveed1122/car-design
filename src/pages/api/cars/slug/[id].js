import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
    get: getBySlug,
});

async function getBySlug(req, res) {

    const car = await carsRepo.getBySlug(req.query.id);
    if (!car) throw 'Car Not Found';

    return res.status(200).json(car);
}