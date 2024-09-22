import { apiHandler, activitiesRepo } from '@/helpers/api';

export default apiHandler({
  post: activeAuctions
});

async function activeAuctions(req, res) {
  const data = await activitiesRepo.activeAuctions(req.body);

  return res.status(200).json(data);
}