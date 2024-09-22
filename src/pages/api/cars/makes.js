import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
    get: getMakesCount
});

async function getMakesCount(req, res) {
    const cars = await carsRepo.getMakesCount();
    return res.status(200).json(cars);
}
