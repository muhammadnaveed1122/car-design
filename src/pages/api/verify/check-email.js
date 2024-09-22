
import { apiHandler, verifiesRepo } from '@/helpers/api';

export default apiHandler({
  post: verifyWithEmail
});


export async function verifyWithEmail(req, res) {
  const { emailTo, code } = req.body;

  verifiesRepo.verify({
    verifyWith: emailTo,
    code
  }).then((verified) => {
    res.status(200).json(verified);
  })
}