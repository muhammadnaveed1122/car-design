import { apiHandler, accountsRepo } from '@/helpers/api';

export default apiHandler({
    put: update,
    delete: _delete,
});

async function update(req, res) {
    await accountsRepo.update(req.query.id, req.body);
    return res.status(200).json({ message: "Account data updated successfully" });
}

async function _delete(req, res) {
    await accountsRepo.delete(req.query.id);
    return res.status(200).json({ message: "Account data deleted successfully" });
}