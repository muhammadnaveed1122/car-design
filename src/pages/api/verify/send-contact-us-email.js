import { apiHandler, sendEmailToContactUs } from '@/helpers/api';
export default apiHandler({
    post: sendContactUsEmail
});
async function sendContactUsEmail(req, res) {
    try {
        console.log(req.body,"body")
        let { name, email, subject, message } = (req.body)
        const html = `<div style="padding: 80px 40px; font-family: system-ui; font-size: 15px; margin: 20px 20px;">
        <h1 style="font-size: 25px; line-height: 1.3; text-align: center; margin-bottom: 20px">Contact Us</h1>
                    <p>Dear Admin,</p>
                    <p>
                        I hope this message finds you well. A new contact form has been submitted on the website. Below are the details provided by the user:
                    </p>

                    <p style="margin-bottom: 0"><strong>Name:</strong> ${name}</p>
                    <p style="margin-bottom: 0"><strong>Email:</strong> ${email}</p>
                    <p style="margin-bottom: 0"><strong>Subject:</strong> ${subject}</p>

                    <strong>Message:</strong>
                    <p>${message ? message : 'No message provided.'}</p>

                    <p>
                        Kindly review and respond to the user's inquiry at your earliest convenience.
                    </p>

                    <p>Thank you,</p>

                </div>`;
        const adminEmail = "arslan.arhamsoft@gmail.com";
        console.log("🚀 ~ sendContactUsEmail ~ adminEmail:", adminEmail)
        await sendEmailToContactUs(adminEmail, subject, html)
        return res.status(200).json({ message: `Admin will contact you shortly`, status: true });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Could Not Sent Email for contact us", status: false })
    }
}