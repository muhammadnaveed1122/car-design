import { apiHandler, userCarRepo } from '@/helpers/api';

export default apiHandler({
    post: markAsSold
});

async function markAsSold(req, res) {
    await userCarRepo.updateStatus(req.body);
    return res.status(200).json({});
}