import { apiHandler, usersRepo } from '@/helpers/api';

export default apiHandler({
    post: googleAuthenticate
});
async function googleAuthenticate(req, res) {
    const user = await usersRepo.googleAuthenticate(req.body);
    return res.status(200).json(user);
}
