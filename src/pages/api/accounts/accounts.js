import { apiHandler, accountsRepo } from '@/helpers/api';

export default apiHandler({
    get: getAllActiveAccounts,
});


async function getAllActiveAccounts(req, res) {
    const data = await accountsRepo.getAllActiveAccounts()
    return res.status(200).json(data);

}