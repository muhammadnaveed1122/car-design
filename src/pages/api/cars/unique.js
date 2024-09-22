import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
  post: getUniqueValues
});

async function getUniqueValues(req, res) {
  const mmvalues = await carsRepo.uniqueValues(req.body);

  return res.status(200).json(mmvalues);
}