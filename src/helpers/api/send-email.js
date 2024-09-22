import FormData from 'form-data';
import Mailgun from 'mailgun.js';
const puppeteer = require("puppeteer");

export async function sendMail(emailTo, subject, html ,htmlText) {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
  const pdf = await convertHTMLToPDF(html)
  const data = {
    from: process.env.MAIL_FROM_ADDRESS,
    to: emailTo,
    subject: subject,
    html: htmlText,
    attachment: { data: pdf, filename: `${subject}.pdf` },
  };
  return await mg.messages.create(process.env.MAILGUN_API_DOMAIN, data);
}

export async function sendEmail(emailTo, subject, html) {
  console.log("process.env.MAILGUN_API_DOMAIN ======", process.env.MAILGUN_API_DOMAIN)
  console.log("process.env.MAILGUN_API_KEY  ======", process.env.MAILGUN_API_KEY )
  console.log("process.env.MAIL_FROM_ADDRESS  ======", process.env.MAIL_FROM_ADDRESS)
  console.log("emailTo  ======", emailTo )


  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
  const data = {
    from: process.env.MAIL_FROM_ADDRESS,
    to: emailTo,
    subject: subject,
    html: html
  };
  return await mg.messages.create(process.env.MAILGUN_API_DOMAIN, data);
}

async function convertHTMLToPDF(htmlContent) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Set content and wait for rendering
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();
  return pdfBuffer;
}

export async function sendEmailToContactUs(emailTo, subject,htmlText){
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
  const data = {
    from: emailTo,
    to: process.env.MAIL_FROM_ADDRESS,
    subject: subject,
    html: htmlText,
  };
  return await mg.messages.create(process.env.MAILGUN_API_DOMAIN, data);  
}
export async function sendMailTOSupport(emailTo, subject,htmlText) {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
  const data = {
    from: emailTo,
    to: process.env.MAIL_FROM_ADDRESS,
    subject: subject,
    html: htmlText,
  };
  return await mg.messages.create(process.env.MAILGUN_API_DOMAIN, data);
}