import { currencyFormater } from '@/constants/data';
import { apiHandler } from '@/helpers/api';
import { sendMail } from '@/helpers/api';
export default apiHandler({
    post: sendBillOfSales
});

async function sendBillOfSales(req, res) {

    let { userName, CarModel, email, doors, mileage, lot, Year, invoiceSent, updatedAt, bidPrice, engine, make, zipCode, vin, state, street, city } = JSON.parse(req.body)
    let dateSale = new Date();

    let day1 = dateSale.getDate();
    let month1 = dateSale.toLocaleString('default', { month: 'short' });
    let year1 = dateSale.getFullYear();

    let formattedDate = `${month1} ${day1}, ${year1}`;

    try {
        const html = ` <div id="invoice"
        style="font-family: Arial, sans-serif;font-size: 12px;font-weight: 400;padding: 40px 60px;max-width: 800px;margin: 0 auto;box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;box-sizing: border-box;">
        <h1 style="margin-top: 12px; margin-bottom: 3px; text-align: center; font-size: 20px;">
            <span style="border-bottom-style: solid; border-bottom-width: 1.25px;">Vehicle Bill of Sale</span>
        </h1>
        <p style="  margin-top: 0; margin-bottom: 0;">For the Exact Sales Amount
            indicated below, I the Seller, do hereby sell and transfer ownership of the Vehicle described below to the
            Buyer, acknowledge full receipt of payment, certify that I have the authority to sell it, warrant the Vehicle
            to be free of any liens or encumbrances, and certify that all information given is true and correct to the
            best of my knowledge.</p>
        <h2 style="margin-top: 12px; margin-bottom: 3px; border-bottom-width: 1px; font-size: 12px;">Vehicle Information
        </h2>
        <table cellspacing="0" cellpadding="0"
            style="border-width: 0.75px; border-style: solid; border-collapse: collapse; width: 100%;">
            <tbody>
                <tr style="height: 28.8px">
                    <td colspan="2"
                        style="width: 210.25px; border-right-style: solid; border-right-width: 0.75px;
                        border-bottom-style: solid; border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px;padding-left: 5.38px; vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px;  ">
                            VEHICLE IDENTIFICATION NUMBER (VIN#)</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                        <strong>${vin ? vin : ''}&nbsp;</strong>
                        </p>
                    </td>
                    <td colspan="2"
                        style="border-right-style: solid ; border-right-width: 0.75px;
                        border-bottom-style: solid ; border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px;padding-left: 5.38px; vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            ENGINE
                            NUMBER (if applicable)</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                        <strong>${engine ? engine : ''}&nbsp;</strong>
                        </p>
                    </td>
                </tr>
                <tr style="height: 28.8px">
                    <td
                        style="width: 75.25px; border-right-style: solid ; border-right-width: 0.75px;
                        border-bottom-style: solid ; border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px;padding-left: 5.38px; vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            YEAR</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>${Year}&nbsp;</strong>
                        </p>
                    </td>
                    <td
                        style="width: 75.25px; border-right-style: solid ; border-right-width: 0.75px;
                        border-bottom-style: solid ; border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px;padding-left: 5.38px; vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            MAKE</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>${make}&nbsp;</strong>
                        </p>
                    </td>
                    <td
                        style="width: 75.25px; border-right-style: solid ; border-right-width: 0.75px;
                        border-bottom-style: solid ; border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px;padding-left: 5.38px; vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            MODEL</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>${CarModel}&nbsp;</strong>
                        </p>
                    </td>
                    <td
                        style="width: 108.2px; border-bottom-style: solid ; border-bottom-width: 0.75px; padding-top: 1.8px;padding-right: 5.38px; padding-left: 5.38px; vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            BODY STYLE (2 Dr; 4 Dr; etc)</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>${doors} Dr&nbsp;</strong>
                        </p>
                    </td>
                </tr>
                <tr style="height: 28.8px">
                    <td style="width: 108.2px;border-right-style: solid ; border-right-width: 0.75px; padding-top: 1.8px;
                        padding-right: 5.38px; padding-left: 5.38px; vertical-align: top">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            SALE DATE
                        </p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>${formattedDate}&nbsp;</strong>
                        </p>
                    </td>
                    <td colspan="2" style="width: 108.2px;border-right-style: solid ; border-right-width: 0.75px;padding-top: 1.8px; padding-right: 5.38px; padding-left: 5.38px;
                        vertical-align: top">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            EXACT
                            SALES AMOUNT</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>$ ${currencyFormater(bidPrice)} (USD)</strong>
                        </p>
                    </td>
                    <td style="width: 108.2px; padding-top: 1.8px; padding-right: 5.38px; padding-left: 5.38px;
                        vertical-align: top">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            Mileage</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>${mileage} mi</strong>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <h2
            style="margin-top: 12px; margin-bottom: 3px; border-bottom-width: 0.75px; border-bottom-style: solid ;padding-bottom: 1; font-size: 12px ">
            Conditions and Warranty</h2>
        <p style="  margin-top: 0; margin-bottom: 0">The Seller has no knowledge of any
            hidden defects in and to the Vehicle, and believes to the best of the Seller's knowledge that the Vehicle is
            being sold in good operating condition &quot;AS-IS,&quot; meaning that there is no warranty for any defects
            and that all repairs are the responsibility of the Buyer.</p>
        <p style="  margin-top: 0; margin-bottom: 0">&nbsp;</p>
        <p style="  margin-top: 0; margin-bottom: 0">Seller allows the Buyer 7
            days to
            have the Vehicle inspected by an independent mechanic, and agrees to cancel the sale if the inspection is
            unsatisfactory to the Buyer.</p>
        <h2
            style="margin-top: 12px; margin-bottom: 3px; border-bottom-width: 0.75px; border-bottom-style: solid ;padding-bottom: 1; font-size: 12px ">
            Odometer Discloser Statement</h2>
        <p style="  margin-top: 0; margin-bottom: 0; "><strong>Federal
                and state
                law requires the Seller of the Vehicle to state the odometer mileage upon the transfer of ownership.
                Failure to complete or a false statement may result in fines and/or imprisonment.</strong></p>
        <p style="  margin-top: 0; margin-bottom: 0">&nbsp;</p>
        <p style="  margin-top: 0; margin-bottom: 0">I the Seller, hereby certify to
            the
            best of my knowledge that the ODOMETER READING listed under the Vehicle information above was not altered,
            set back, or disconnected while in the Seller's possession, and the Seller has no knowledge of anyone doing
            so, and is (check one of the following):</p>
        <p style="  margin-top: 0; margin-bottom: 0">&nbsp;</p>
        <p style="  margin-top: 0; margin-bottom: 0; font-size: 14px ">
            [&nbsp;<span style="color: red; font-weight: 700">X</span>&nbsp;]<span style="">&nbsp;&nbsp;</span><span style="">THE ACTUAL MILEAGE</span>
        </p>
        <p style="  margin-top: 0; margin-bottom: 0; font-size: 14px ">
        <span style="">&nbsp;&nbsp;</span><span style="">MILEAGE IN EXCESS OF
                MECHANICAL LIMITS</span></p>
        <p style="  margin-top: 0; margin-bottom: 0; font-size: 14px ">
        <span style="">&nbsp;&nbsp;</span><span style="">NOT THE ACTUAL
                MILEAGE.&nbsp;</span><strong><span style="">WARNING!</span></strong><span
                style="">&nbsp;ODOMETER DISCREPANCY</span></p>
        <p style="  margin-top: 0; margin-bottom: 0">&nbsp;</p>
        <p style="  margin-top: 0; margin-bottom: 0">&nbsp;</p>
        <table cellspacing="0" cellpadding="0" style="border-collapse: collapse; width: 100%">
            <tbody>
                <tr style="height: 28.8px">
                    <td
                        style="width: 192.25; border-style: solid; border-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px; padding-left: 5.38px; vertical-align: top">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px;">
                            <strong>SELLER'S SIGNATURE</strong><br />
                            <strong style="font-family: monospace;">Trade Dept</strong>
                        </p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>&nbsp;</strong>
                        </p>
                    </td>
                    <td colspan="2" style="width: 168.5px; border-top-style: solid ; border-top-width: 0.75px;
                        border-right-style: solid ; border-right-width: 0.75px; border-bottom-style: solid ;
                        border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px; padding-left: 5.38px;
                        vertical-align: top">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            SELLER'S
                            PRINTED NAME</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>Trade Dept</strong>
                        </p>
                    </td>
                    <td colspan="2" style="width: 168.5px; border-top-style: solid ; border-top-width: 0.75px;
                        border-right-style: solid ; border-right-width: 0.75px; border-bottom-style: solid ;
                        border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px; padding-left: 5.38px;
                        vertical-align: top">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            DATE</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>${formattedDate}&nbsp;</strong>
                        </p>
                    </td>
                </tr>
                <tr style="height: 28.8px">
                    <td
                        style="width: 192.25px; border-left-style: solid; border-left-width: 0.75px;border-right-style: solid ; border-right-width: 0.75px; border-bottom-style: solid ;border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px; padding-left: 5.38px;vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            SELLER'S
                            ADDRESS</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>9838 N 19th Ave&nbsp;</strong>
                        </p>
                    </td>
                    <td
                        style="width: 132.5; border-right-style: solid ; border-right-width: 0.75px;
                        border-bottom-style: solid ; border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px;padding-left: 5.38px; vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            CITY</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>Phoenix&nbsp;</strong>
                        </p>
                    </td>
                    <td colspan="2"
                        style="width: 51.5; border-right-style: solid ; border-right-width: 0.75px;
                        border-bottom-style: solid ; border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px;padding-left: 5.38px; vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            STATE</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>AZ&nbsp;</strong>
                        </p>
                    </td>
                    <td
                        style="width: 56.55; border-right-style: solid ; border-right-width: 0.75px;
                        border-bottom-style: solid ; border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px;padding-left: 5.38px; vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            ZIP</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>85021&nbsp;</strong>
                        </p>
                    </td>
                </tr>
                <tr style="height: 0 ">
                    <td style="width: 198.4 "><br /></td>
                    <td style="width: 140.4 "><br /></td>
                    <td style="width: 35.55 "><br /></td>
                    <td style="width: 26.5 "><br /></td>
                    <td style="width: 66.65 "><br /></td>
                </tr>
            </tbody>
        </table>
        <p style="  margin-top: 0; margin-bottom: 0">&nbsp;</p>
        <table cellspacing="0" cellpadding="0" style="border-collapse: collapse ; width: 100%">
            <tbody>
                <tr style="height: 28.8px">
                    <td
                        style="width: 192.25; border-style: solid; border-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px; padding-left: 5.38px; vertical-align: top">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            <strong>BUYER'S SIGNATURE</strong>
                        </p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>&nbsp;</strong>
                        </p>
                    </td>
                    <td colspan="2" style="width: 168.5px; border-top-style: solid ; border-top-width: 0.75px;
                        border-right-style: solid ; border-right-width: 0.75px; border-bottom-style: solid ;
                        border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px; padding-left: 5.38px;
                        vertical-align: top">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            BUYER'S
                            PRINTED NAME</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>${userName}&nbsp;</strong>
                        </p>
                    </td>
                    <td colspan="2" style="width: 83.55; border-top-style: solid ; border-top-width: 0.75px;
                        border-right-style: solid ; border-right-width: 0.75px; border-bottom-style: solid ;
                        border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px; padding-left: 5.38px;
                        vertical-align: top">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            DATE</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>${formattedDate}&nbsp;</strong>
                        </p>
                    </td>
                </tr>
                <tr style="height: 28.8px">
                    <td
                        style="width: 192.25px; border-left-style: solid; border-left-width: 0.75px;border-right-style: solid ; border-right-width: 0.75px; border-bottom-style: solid ;border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px; padding-left: 5.38px;vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            BUYER'S
                            ADDRESS</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong> ${street ? street : ''}
                            &nbsp;</strong>
                        </p>
                    </td>
                    <td
                        style="width: 132.5; border-right-style: solid ; border-right-width: 0.75px;
                        border-bottom-style: solid ; border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px;padding-left: 5.38px; vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            CITY</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>${city ? city : ''}&nbsp;</strong>
                        </p>
                    </td>
                    <td colspan="2"
                        style="width: 51.5; border-right-style: solid ; border-right-width: 0.75px;
                        border-bottom-style: solid ; border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px;padding-left: 5.38px; vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            STATE</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>${state ? state : ''}&nbsp;</strong>
                        </p>
                    </td>
                    <td
                        style="width: 56.55; border-right-style: solid ; border-right-width: 0.75px;
                        border-bottom-style: solid ; border-bottom-width: 0.75px; padding-top: 1.8px; padding-right: 5.38px;padding-left: 5.38px; vertical-align: top ">
                        <p
                            style="  margin-top: 0; margin-bottom: 2px; ">
                            ZIP</p>
                        <p style="  margin-top: 0; margin-bottom: 0; ">
                            <strong>${zipCode}&nbsp;</strong>
                        </p>
                    </td>
                </tr>
                <tr style="height: 0 ">
                    <td style="width: 198.45 "><br /></td>
                    <td style="width: 140.35 "><br /></td>
                    <td style="width: 35.55 "><br /></td>
                    <td style="width: 26.5 "><br /></td>
                    <td style="width: 66.65 "><br /></td>
                </tr>
            </tbody>
        </table>`;

        const htmlText = `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 10px auto; padding: 40px; border-radius: 10px;">

        <p style="font-size: 16px; line-height: 1.5; color: #333;">Dear ${userName},</p>
    
        <p style="font-size: 16px; line-height: 1.5; color: #333;">Thank you for purchasing the ${Year} ${CarModel} from Trade Dept! We hope you will enjoy your new vehicle.</p>
    
        <p style="font-size: 16px; line-height: 1.5; color: #333;">Attached to this email, you will find your official Bill of Sale for the vehicle. Please review it carefully and keep it in a safe place for your records. It serves as proof of ownership and is important for tasks like registering the vehicle in your name and obtaining insurance.</p>
    
        <p style="font-size: 16px; line-height: 1.5; color: #333;">Thank you again for choosing Trade Dept! We wish you many safe and happy miles in your new vehicle.</p>
    
        <p style="font-size: 16px; line-height: 1.5; color: #333;">Sincerely,<br>
        The Team at Trade Dept</p>
    
    </div>
    `

        await sendMail(email, "Bill Of Sales", html, htmlText);
        return res.status(200).json({ message: `BILL OF SALES SENDED TO MAIL: ${email}` });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "COULD NOT SEND BILL OF SALES" })

    }

}