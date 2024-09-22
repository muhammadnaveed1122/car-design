import { currencyFormater } from '@/constants/data';
import { apiHandler } from '@/helpers/api';
import { sendEmail, sendMail } from '@/helpers/api';

export default apiHandler({
    post: sendInvoice
});

async function sendInvoice(req, res) {
    let { userName, UserPhone, CarModel, email, color, Year, carName, make, bidPrice, vin, CustomerId, id, state, street, city, zipCode, bankName, accountTitle, accountNumber, routingNumber } = JSON.parse(req.body)
    let date = new Date();
    let day = date.getDate();
    let month = date.toLocaleString('default', { month: 'short' });
    let year = date.getFullYear();

    let formattedDate = `${month} ${day}, ${year}`;

    try {
        const html = `
        <div
        style="font-family: Arial, sans-serif;font-size: 12px;padding: 40px 60px;max-width: 800px;min-width: 650px;margin: 0 auto;box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;box-sizing: border-box;">
        <table style="border-collapse: collapse;width: 100%;table-layout: fixed;margin-bottom: 20px;">
            <thead>
                <tr style="border: 1px dotted #c2c1c1;">
                    <td style="border: 1px dotted #c2c1c1;">
                        <img src="https://spaces1234.nyc3.cdn.digitaloceanspaces.com/logo/cexauto-light-logo.png" alt="logo" style="max-width:100%; height:auto;" />
                    </td>
                    <td style="border: 1px dotted #c2c1c1;padding: 20px 5px;">
                        <span style="font-size: 20px;line-height: 1.3;font-weight: 700;text-transform: uppercase;">
                            INVOICE-${CustomerId}-${id}
                        </span>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr style="background-color: rgb(214, 227, 188);font-weight: 700;">
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        FROM
                    </td>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        DETAILS
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 16px;font-weight: 700;border: 1px dotted #c2c1c1;">
                        Trade Dept LLC
                    </td>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        DATE: ${formattedDate}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        Mark Williams
                    </td>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        INVOICE-${CustomerId}-${id}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        9838 N 19th Ave
                    </td>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        SALESPERSON: Trade Dept
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        Phoenix, AZ 85021
                    </td>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        +40-726-755-561
                    </td>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        contact@cexauto.ro	
                    </td>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                    </td>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                    </td>
                </tr>
                <tr style="background-color: rgb(214, 227, 188);font-weight: 700;">
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        BILL TO
                    </td>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        VEHICLE INFORMATION
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 16px;font-weight: 700;border: 1px dotted #c2c1c1;">
                        ${userName}
                    </td>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        MAKE: ${make}
                    </td>
                <tr>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                       ${street ? street : ''}
                    </td>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        MODEL: ${CarModel}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                    ${city ? city : ''}, ${state ? state : ''} ${zipCode ? zipCode : ""}
                    </td >
        <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
            YEAR: ${Year}
        </td>
                </tr >
                <tr>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        ${UserPhone}
                    </td>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        COLOR: ${color}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        ${email}
                    </td>
                    <td style="padding: 8px 16px;border: 1px dotted #c2c1c1;">
                        VIN: ${vin ? vin : ''}
                    </td>
                </tr>
                </tr >
            </tbody >
        </table >
        <table style="font-weight: 700;border-collapse: collapse;width: 100%;border: 1px dotted #000000;">
            <tbody>
                <tr style="background-color: rgb(214, 227, 188);">
                    <td style="padding: 8px 16px;border: 1px solid #000000;">
                        DESCRIPTION
                    </td>
                    <td style="padding: 8px 16px;border: 1px solid #000000;">
                        AMOUNT ($)
                    </td>
                </tr>
                <tr style="height: 150px;vertical-align: top;">
                    <td style="padding: 8px 16px;border: 1px solid #000000;">
                        <p style="margin-bottom: 10px;margin-top: 0;">Used ${Year} ${carName}</p>
                        <p>Notes: <br />Shipping address the same as billing address </p>
                    </td>
                    <td style="padding: 8px 16px;border: 1px solid #000000;">
                    ${currencyFormater(bidPrice)}$
                    </td>
                </tr>
            </tbody>
        </table>
        <div style="display: flex; justify-content: space-between;">
            <table style="border-collapse: collapse; border: 1px solid #000000;width:60%;">
                <tbody style="">
                    <tr>
                        <td colspan="2" style="padding: 4px 8px 0;font-weight: 700;">
                            BANK DETAILS
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 8px;font-weight: 700;">BANK NAME:</td>
                        <td style="font-weight: 500;">${bankName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 0 8px;font-weight: 700;">ACCOUNT NAME:</td>
                        <td style="font-weight: 500;">${accountTitle}</td>
                    </tr>
                    <tr>
                        <td style="padding: 0 8px;font-weight: 700;">ACCOUNT NUMBER:</td>
                        <td style="font-weight: 500;">${accountNumber}</td>
                    </tr>
                    <tr>
                        <td style="padding: 0 8px 4px;font-weight: 700;">ROUTING NUMBER:</td>
                        <td style="font-weight: 500;">${routingNumber}</td>
                    </tr>
                </tbody>
            </table>
            <table style=" margin-left: auto; font-weight: 700; border-collapse: collapse; border: 1px solid #000000; margin-bottom: 15px; width:40%;">
                <tbody>
                    <tr>
                        <td style="padding: 8px 16px; border: 1px solid #000000;">SUBTOTAL</td>
                        <td style="padding: 8px 16px; border: 1px solid #000000;">${currencyFormater(bidPrice)}$</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 16px; border: 1px solid #000000;">DISCOUNT</td>
                        <td style="padding: 8px 16px; border: 1px solid #000000;">N/A</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 16px; border: 1px solid #000000;">TOTAL</td>
                        <td style="padding: 8px 16px; border: 1px solid #000000;">${currencyFormater(bidPrice)}$</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div >
        `;

        const htmlText = `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 10px auto; padding: 40px; border-radius: 10px;">
    <p style="font-size: 16px;">Hi ${userName},</p>

    <p style="font-size: 14px;">There’s a new invoice available for your Trade Dept account.</p>

    <ul style="list-style-type: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 8px;">Invoice Number: ${CustomerId}-${id}</li>
        <li style="margin-bottom: 8px;">Issue Date: ${formattedDate}</li>
        <li style="margin-bottom: 8px;">Total: €${currencyFormater(bidPrice)}</li>
    </ul>

    <p style="font-size: 14px;">Many thanks!</p>

    <p style="font-size: 14px;">Trade Dept<br>
    At Trade Dept, we take immense pride in being more than just a car dealership; we're your trusted automotive partner. Our commitment to excellence and unwavering dedication to customer satisfaction have earned us the reputation of being the best in the business.</p>
</div>`;

        await sendMail(email, "Invoice", html, htmlText);
        return res.status(200).json({ message: `Invoice Sent to E-Mail Address: ${email} ` });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Could Not Send Invoice" })
    }
}
