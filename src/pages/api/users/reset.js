import { apiHandler, usersRepo } from '@/helpers/api';

export default apiHandler({
    post: resetPassword
});

async function resetPassword(req, res) {
    await usersRepo.resetPassword(req.body);
    return res.status(200).json({ success: true });
}
