import { apiHandler, usersRepo } from '@/helpers/api';

export default apiHandler({
    get:getAllTrashedUser
});


async function getAllTrashedUser(req, res) {
    const users = await usersRepo.getAllTrashedUser(req.query);
    return res.status(200).json(users);
}