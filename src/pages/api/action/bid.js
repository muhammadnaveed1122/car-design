import { apiHandler, activitiesRepo } from '@/helpers/api';

export default apiHandler({
  post: bid
});

async function bid(req, res) {
  const status = await activitiesRepo.bid(req.body);

  return res.status(200).json({ message: "Bidded Successfully", bid: status });
}