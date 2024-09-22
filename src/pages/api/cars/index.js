import { apiHandler, carsRepo } from '@/helpers/api';
import { withCors } from '@/helpers';
export default withCors(apiHandler({
    get: getAll
}));
async function getAll(req, res) {
    const cars = await carsRepo.getAll();
    return res.status(200).json(cars);
}
