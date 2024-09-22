import { apiHandler, userCarRepo } from '@/helpers/api';

export default apiHandler({
    get: getAllAuction
});

async function getAllAuction(req, res) {
    const cars = await userCarRepo.getAllAuction();
    return res.status(200).json(cars);
}
