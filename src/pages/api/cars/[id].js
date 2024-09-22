import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete,
    put: updateSteps,
});

async function getById(req, res) {
    const car = await carsRepo.getById(req.query.id);
    if (!car) throw 'Car Not Found';

    return res.status(200).json(car);
}

async function update(req, res) {
    await carsRepo.update(req.query.id, req.body);
    return res.status(200).json({});
}

async function _delete(req, res) {
    await carsRepo.delete(req.query.id);
    return res.status(200).json({});
}

async function updateSteps(req, res) {
    await carsRepo.updateSteps(req.query.id, req.body);
    return res.status(200).json({ message: "Data updated successfully" });
}

async function updateWinBox(req, res) {
    await carsRepo.updateWinBox(req.query.id);
    return res.status(200).json({ message: "Congrats updated successfully" });
}