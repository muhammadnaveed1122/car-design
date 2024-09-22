import { apiHandler, usersRepo } from '@/helpers/api';

export default apiHandler({
    put: updateUserPurchase,
});

async function updateUserPurchase(req, res) {
    await usersRepo.updateUserPurchase(req.query.id, req.body);
    return res.status(200).json({ message: "Data updated successfully" });
}