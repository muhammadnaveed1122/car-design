
import { apiHandler, verifiesRepo } from '@/helpers/api';

export default apiHandler({
  post: verifyWithPhone
});


export async function verifyWithPhone(req, res) {
  const { phoneNum, code } = req.body;

  verifiesRepo.verify({
    verifyWith: phoneNum,
    code
  }).then((verified) => {
    res.status(200).json(verified);
  })
}