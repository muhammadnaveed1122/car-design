
import { apiHandler, verifiesRepo } from '@/helpers/api';
import { sendEmail } from '@/helpers/api';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const SiteURL = publicRuntimeConfig.SiteURL;
export default apiHandler({
  post: sendVerificationCode
});


export async function sendVerificationCode(req, res) {
  const { emailTo } = req.body;

  try {
    const checkEmailExsist = await verifiesRepo.checkEmailExsist(emailTo);
    if (checkEmailExsist) {
      return res.status(500).json({ message: "Email already exsist", status: false })
    }
    const code = await verifiesRepo.send({
      verifyWith: emailTo
    });

    const subject = 'Trade Dept #Verficiation Code';

    const html =
      `<div style="font-family: Arial, Helvetica, sans-serif; padding: 30px 20px;">
        <div style="width: 700px ; margin: 30px auto ; border: 1px solid #e0e0e0;">
        <div style="background-color: #000 ; padding: 20px;">
        <div style="width: 140px; margin: 0 auto;">
                    <img src="https://spaces1234.nyc3.cdn.digitaloceanspaces.com/logo/cexauto-light-logo.png"
                        style="width: 100% ; height: 100%; max-width: 100%;" />
                </div>
            </div>
            <div style="padding: 30px 30px 0px 30px ; margin-bottom: 35px;">
                <h3 style="font-size: 22px; font-weight: bold ; margin-bottom: 15px;">Trade Dept </h3>
                <p style="font-size: 17px ; margin-bottom: 35px;">
                <div style="font-family: Poppins, sans-serif; font-size: 28px; line-height: 30px;">
                    <div style="width: 100%; text-align: center;">Hi!</div>
                    <div style="width: 100%; text-align: center;">Here is the confirmation code for your online form:</div>
                    <h1 style="width: 100%; text-align: center; font-weight: 900;">${code}</h1>
                    <div style="width: 100%; text-align: center; margin-bottom: 20px;">All you have to do is copy the
                        confirmation code and paste it to your form to complete the email verification process.</div>
                    <div style="padding: 10px;">
                        <div style="width: 100%; text-align: center; font-size: 14px;">
                            <p>If you no longer wish to receive our emails, you can <a
                                    href="${SiteURL}">unsubscribe here</a>.</p>
                        </div>
                    </div>
                </div>
                </p>
            </div>
            <div style="background-color: #000 ; padding: 30px ; text-align: center; color:white;">            
            <a href="${SiteURL}" style="text-decoration: none; font-size:16px; color: #f8a26b; font-weight:bolder;">
            Trade Dept
            </a>
           Bucuresti, Romania
       </div>
        </div>
    </div>
    `;

    sendEmail(emailTo, subject, html);

    return res.status(200).json({ message: `CODE SENDED TO MAIL: ${emailTo}`, status: true });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "COULD NOT SEND VERIFICATION CODE" })
  }
}