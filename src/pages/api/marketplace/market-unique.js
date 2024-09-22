import { apiHandler, userCarRepo } from '@/helpers/api';

export default apiHandler({
    post: getuniqueMarketValues
});
async function getuniqueMarketValues(req, res) {
    const mmvalues = await userCarRepo.uniqueMarketValues(req.body)
    return res.status(200).json(mmvalues);

}