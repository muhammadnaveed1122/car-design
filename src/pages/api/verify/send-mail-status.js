import { currencyFormater } from '@/constants/data';
import { apiHandler, sendSms } from '@/helpers/api';
import { sendEmail } from '@/helpers/api';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const SiteURL = publicRuntimeConfig.SiteURL;
export default apiHandler({
    post: sendMailStatus
});

async function sendMailStatus(req, res) {
    let params = JSON.parse(req.body)
    const { price, email, purchaseSteps, phoneNum, name, carName } = params
    let subject = null;
    let content = null
    let mobileContent = null;
    const currentDate = new Date()
    let nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    let next3Day = new Date(currentDate);
    next3Day.setDate(currentDate.getDate() + 3);
    let day = nextDay.getDate();
    let month = nextDay.toLocaleString('default', { month: 'short' });
    let year = nextDay.getFullYear();

    let formattedDate = `${month} ${day}, ${year}`;
    const next3days = `${month} ${next3Day.getDate()}, ${year}`;
    try {
        if (purchaseSteps === 1) {
            subject = "Invoice & Bill of Sale";
            content = `
            Hi <span
            style="color: #FF5862 ;"> ${name} </span>, your invoice for <b>${carName}</b> is ready! The amount of <b>€${currencyFormater(price)}</b> is due by <b>${formattedDate}</b>. Please check your registered email. Thank you!`
            mobileContent = `
            Hi ${name} , your invoice for ${carName} is ready! The amount of €${currencyFormater(price)} is due by
            ${formattedDate}. Please check your registered email. Thank you!`
        } else if (purchaseSteps === 2) {
            subject = "Payment Confirmation";
            content = `Hi <span
            style="color: #FF5862 ;"> ${name} </span>, your payment for <b>${carName}</b> has been received! Your order is now being processed and will be ready to ship within 5 working days. Thank you!`
            mobileContent = `Hi ${name}, your payment for ${carName} has been received! Your order is now being processed and will be ready to ship within 5 working days. Thank you!`
        } else if (purchaseSteps === 3) {
            subject = "Shipping Initiated";
            content = `Hi <span
            style="color: #FF5862 ;"> ${name} </span>, your <b>${carName}</b> is getting ready for shipping. Sit back and relax while we do the work for you. Thank you!`
            mobileContent = `Hi ${name}, your ${carName} is getting ready for shipping. Sit back and relax while we do the work for you. Thank you!`
        } else if (purchaseSteps === 4) {
            subject = "Vehicle Dispatched";
            content = `Hi <span
            style="color: #FF5862 ;"> ${name} </span>, your <b>${carName}</b> was shipped. You will be contacted 24h before, the estimated time of arrival is ${next3days}. Thank you!`
            mobileContent = `Hi ${name} , your ${carName} was shipped. You will be contacted 24h before, the estimated time of arrival is ${next3days}. Thank you!`
        } else if (purchaseSteps === 5) {
            subject = "Delivered";
            content = `Hi <span
            style="color: #FF5862 ;"> ${name} </span>, please check your email regarding the delivery. One of our team members will contact you shortly. Thank you!`
            mobileContent = `Hi ${name}, please check your email regarding the delivery. One of our team members will contact you shortly. Thank you!`
        }

        const html = `
        <div style="font-family: Arial, Helvetica, sans-serif; padding: 30px 20px;">
            <div style="width: 700px ; margin: 30px auto ; border: 1px solid #e0e0e0;">
                <div style="background-color: #000;padding: 20px;">
                    <div style="width: 140px; margin: 0 auto;">
                        <img src="https://spaces1234.nyc3.cdn.digitaloceanspaces.com/logo/cexauto-light-logo.png"
                            style="width: 100% ; height: 100%; max-width: 100%;" />
                    </div>
                </div>
                <div style="padding: 30px 30px 0px 30px ; margin-bottom: 35px;">
                    <h3 style="font-size: 22px; font-weight: bold ; margin-bottom: 15px;">Trade Dept </h3>
                    <p style="font-size: 17px ; margin-bottom: 35px;">
                        ${content}
                    </p>
                </div>
                <div style="background-color: #000;padding: 30px ; text-align: center; color:white;">
            
                 <a href="${SiteURL}" style="text-decoration: none; font-size:16px; color: #f8a26b; font-weight:bolder;">
                 Trade Dept</a>
                Bucuresti, Romania
            </div>
            </div>
        </div>
        `;
        const mobile = mobileContent

        await sendEmail(email, subject, html);
        await sendSms(phoneNum.replace(/^\D+/g, ''), mobile)
        return res.status(200).json({ message: `Email Sent with subject: ${subject} to E-Mail Address: ${email} ` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Could Not Send Email" });
    }
}
