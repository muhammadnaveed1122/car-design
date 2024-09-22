
import { apiHandler, verifiesRepo } from '@/helpers/api';
import { sendSms } from '@/helpers/api';

export default apiHandler({
  post: sendVerificationCode
});


export async function sendVerificationCode(req, res) {
  const { phoneNum } = req.body;
    
  try {
    const code = await verifiesRepo.send({
      verifyWith: phoneNum
    });

    const msg = `Phone Verification Code: ${code}`;

    const smsMessage = await sendSms(phoneNum.replace(/^\D+/g, ''), msg);

    return res.status(200).json({ message: `CODE SENDED TO PHONE: ${phoneNum}` });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "COULD NOT SEND VERIFICATION CODE", error: error })
  }
}