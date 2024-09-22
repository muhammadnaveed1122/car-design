import { apiHandler, carsRepo, userCarRepo } from '@/helpers/api';

export default apiHandler({
  post: getUniqueValues,
  post: getuniqueMarketValues
});

async function getUniqueValues(req, res) {
  const mmvalues = await userCarRepo.uniqueValues(req.body);

  return res.status(200).json(mmvalues);
}
async function getuniqueMarketValues(req, res) {
  const mmvalues = await userCarRepo.uniqueMarketValues(req.body)
  return res.status(200).json(mmvalues);

}