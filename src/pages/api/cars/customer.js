import { apiHandler, carsRepo } from '@/helpers/api';
export default apiHandler({
    get: getAllCusmtoer
});
async function getAllCusmtoer(req, res) {
    const customer = await carsRepo.getAllCusmtoer(req.query)
    return res.status(200).json(customer);

}