
import { apiHandler, findAddress } from '@/helpers/api';

export default apiHandler({
  post: findLookupAddress
});


export async function findLookupAddress(req, res) {
  const { lookup } = req.body;

  try {
    const result = await findAddress(lookup);

    return res.status(200).json(result);

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "COULD NOT FIND PROPER ADDRESS" })
  }
}