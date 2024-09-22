import { apiHandler, identityRepo } from '@/helpers/api';

export default apiHandler({
    get: getAll
});

async function getAll(req, res) {
    const identityAccounts = await identityRepo.List();
    return res.status(200).json(identityAccounts);
}
