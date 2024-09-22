import { apiHandler } from '@/helpers/api';
import { sendEmail } from '@/helpers/api';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const SiteURL = publicRuntimeConfig.SiteURL;
export default apiHandler({
  post: sendBidVerificationEmail
});

export async function sendBidVerificationEmail(req, res) {
  const { emailTo } = req.body;

  try {
    const subject = 'Congratulations! You Have Won a Car Bid';

    const html =
      `<div style="font-family: Arial, Helvetica, sans-serif; padding: 30px 20px;">
        <div style="width: 700px; margin: 30px auto; border: 1px solid #e0e0e0;">
          <div style="background-color: #000; padding: 20px;">
            <div style="width: 140px; margin: 0 auto;">
              <img src="https://spaces1234.nyc3.cdn.digitaloceanspaces.com/logo/cexauto-light-logo.png"
                   style="width: 100%; height: 100%; max-width: 100%;" />
            </div>
          </div>
          <div style="padding: 30px 30px 0px 30px; margin-bottom: 35px;">
            <h3 style="font-size: 22px; font-weight: bold; margin-bottom: 15px;">Trade Dept</h3>
            <p style="font-size: 17px; margin-bottom: 35px;">
              <div style="font-family: Poppins, sans-serif; font-size: 28px; line-height: 30px;">
                <div style="width: 100%; text-align: center;">Hi!</div>
                <div style="width: 100%; text-align: center;">Congratulations! You have won the car bid.</div>
                <div style="width: 100%; text-align: center; margin: 20px 0;">
                  Please check your account for further details on how to claim your car.
                </div>
                <div style="padding: 10px;">
                  <div style="width: 100%; text-align: center; font-size: 14px;">
                    <p>If you have any questions or need further assistance, please contact us at <a href="mailto:contact@cexauto.ro">contact@cexauto.ro</a>.</p>
                  </div>
                </div>
              </div>
            </p>
          </div>
          <div style="background-color: #000; padding: 30px; text-align: center; color: white;">
            <a href="${SiteURL}" style="text-decoration: none; font-size: 16px; color: #f8a26b; font-weight: bolder;">Trade Dept</a>
            Bucuresti, Romania
          </div>
        </div>
      </div>`;

    sendEmail(emailTo, subject, html);

    return res.status(200).json({ message: `Congratulations! You have won a car bid. A message has been sent to your email: ${emailTo}` });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Could not send winning message. Please try again later." });
  }
}
