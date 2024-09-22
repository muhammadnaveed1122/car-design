import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
    put: updateWinBox,
});
async function updateWinBox(req, res) {
    await carsRepo.updateWinBox(req.query.id);
    return res.status(200).json({ message: "Congrats updated successfully" });
}