
import { apiHandler, sendEmail } from '@/helpers/api';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const SiteURL = publicRuntimeConfig.SiteURL;
export default apiHandler({
  post: sendApproval
});


export async function sendApproval(req, res) {
  const { emailTo, fullName } = req.body;

  try {
    const subject = 'Trade Dept #Approval';

    const html = `
    <div style="font-family: Poppins, sans-serif; font-size: 28px; line-height: 30px;">
      <div style="width: 100%; text-align: center;">Hi, ${fullName}!</div>
      <h3 style="width: 100%; text-align: center;">We are pleased to inform you that you are approved to <span style="font-weight: 800;">Trade Dept</span></h3>
      <div style="width: 100%; text-align: center;">
        Now you can log into the Trade Dept website using your email address and password used for sign-up
      </div>
      
      <div style="background-color: #000 ; padding: 30px ; text-align: center; color:white;">
          <a href="${SiteURL}" style="text-decoration: none; font-size:16px; color: #f8a26b; font-weight:bolder;">Trade Dept</a>
          Bucuresti, Romania
      </div>
    </div>
    `;

    sendEmail(emailTo, subject, html);

    return res.status(200).json({ message: `CODE SENDED TO MAIL: ${emailTo}` });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "COULD NOT SEND APPROVAL TO EMAIL" })
  }
}