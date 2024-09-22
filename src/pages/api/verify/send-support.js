import { apiHandler } from '@/helpers/api';
import { sendMailTOSupport } from '@/helpers/api';
import { supportRepo } from '@/helpers/api/supports-repo';

export default apiHandler({
    post: sendSupport
});

async function sendSupport(req, res) {
    try {
        let { subject, email, message } = JSON.parse(req.body)
        const html = `<div style="padding: 80px 40px;
        font-family: system-ui;
        font-size: 15px;
        margin: 20px 20px;">
        
        <p>Dear Admin,</p>

        <p>
            I hope this message finds you well. A new contact form has been submitted on the website. Below are the details provided by the user:
        </p>

        <p style="margin-bottom: 0"><strong>Name:</strong> ${subject}</p>
        <p><strong>Email:</strong> ${email}</p>

        <strong>Message:</strong>
        <p>${message}</p>

        <p>
            Kindly review and respond to the user's inquiry at your earliest convenience.
        </p>

        <p>Thank you,</p>
        
        </div>`

        await sendMailTOSupport(email, "Support", html)
        const params = { name: subject, message, email }
        await supportRepo.create(params)
        return res.status(200).json({ message: `Email Sent to Support` });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Could Not Sent Email To Support" })
    }
}