import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
    get: getLatestByActivities
});
async function getLatestByActivities(req, res) {
    const data = await carsRepo.getLatestByActivities(req.query.id)

    return res.status(200).json(data)
}