import { apiHandler, identityRepo } from "@/helpers/api";

export default apiHandler({
  put: update,
  delete: _delete,
  get: getById,
});

async function update(req, res) {
  await identityRepo.update(req.query.id, req.body);
  return res
    .status(200)
    .json({ message: "identity Account updated successfully" });
}

async function _delete(req, res) {
  await identityRepo.delete(req.query.id);
  return res
    .status(200)
    .json({ message: "identity Account deleted successfully" });
}
async function getById(req, res) {
  const account = await identityRepo.getById(req.query.id);
  return res.status(200).json({ identityAcount: account });
}
