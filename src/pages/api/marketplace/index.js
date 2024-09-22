import { apiHandler, userCarRepo } from '@/helpers/api';

export default apiHandler({
    get: getAll
});

async function getAll(req, res) {
    const cars = await userCarRepo.getAll();
    return res.status(200).json(cars);
}
