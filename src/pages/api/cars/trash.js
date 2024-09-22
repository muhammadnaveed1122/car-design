import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
    get:getAllTrashedUser
});


async function getAllTrashedUser(req, res) {
    const users = await carsRepo.getAllTrashedCustomer(req.query);
    return res.status(200).json(users);
}