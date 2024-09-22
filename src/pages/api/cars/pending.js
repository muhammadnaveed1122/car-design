import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
    get: getAllPendingCars
});

async function getAllPendingCars(req, res) {
    const cars = await carsRepo.getAllPendingCars(req.query);
    return res.status(200).json(cars);
}
