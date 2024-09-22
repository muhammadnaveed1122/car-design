import { apiHandler, paymentRepo } from '@/helpers/api';

export default apiHandler({
    put: update,
    delete: _delete,
    get: getById
});

async function update(req, res) {
    await paymentRepo.update(req.query.id, req.body);
    return res.status(200).json({ message: "Payment Account updated successfully" });
}

async function _delete(req, res) {
    await paymentRepo.delete(req.query.id);
    return res.status(200).json({ message: "Payment Account deleted successfully" });
}
async function getById(req, res) {
    const account = await paymentRepo.getById(req.query.id);
    return res.status(200).json({ pAccount :account });
}