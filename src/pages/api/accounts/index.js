import { apiHandler, accountsRepo } from '@/helpers/api';

export default apiHandler({
    get: getAllAccounts,
});

async function getAllAccounts(req, res) {
    const cars = await accountsRepo.getAllAccounts(req.query);
    return res.status(200).json(cars);
}