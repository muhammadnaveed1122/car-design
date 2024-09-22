import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
  post: market
});

async function market(req, res) {
  const demoCars = await carsRepo.demoCars(req.body);

  return res.status(200).json(demoCars);
}