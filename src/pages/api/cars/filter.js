import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
  post: searchCars
});

async function searchCars(req, res) {
  const filteredCars = await carsRepo.filter(req.body);

  return res.status(200).json(filteredCars);
}