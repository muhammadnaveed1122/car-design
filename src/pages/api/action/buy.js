import { apiHandler, activitiesRepo } from '@/helpers/api';

export default apiHandler({
  post: buy
});

async function buy(req, res) {
  const msg = await activitiesRepo.buy(req.body);

  return res.status(200).json(msg);
}