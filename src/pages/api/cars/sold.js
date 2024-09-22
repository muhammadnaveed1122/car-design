import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
  post: soldCars
});

async function soldCars(req, res) {
  const soldCars = await carsRepo.carsOnSale(req.body);

  return res.status(200).json(soldCars);
}