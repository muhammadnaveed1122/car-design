import { carService, userService } from "@/services";
import { useState, useEffect, useRef } from "react";
import { currencyFormater } from "@/constants/data";
import { Group, Button } from "@mantine/core";
import jsPDF from 'jspdf';

export default function InvoiceTemplate({ carId }) {

	const invoiceRef = useRef(null);
	const [sellerInfo, setSellerInfo] = useState(null);
	const [carInfo, setCarInfo] = useState(null);
	const [sellerAddr, setSellerAddr] = useState(null);
	const [buyerAddr, setBuyerAddr] = useState(null);

	useEffect(() => {
		carService.getById(carId)
			.then(res => {
				setCarInfo(res);
				setBuyerAddr(JSON.parse(res?.User?.address));
			})
		userService.getAdminById(1).then(res => {
			setSellerInfo(res);
			setSellerAddr(JSON.parse(res?.address));
		});
	}, [carId]);

	const handleGeneratePdf = () => {
		const doc = new jsPDF('px', 'px', [770, 1200]);
		doc.setTextColor('black')
		doc.html(invoiceRef.current, {
			async callback(doc) {
				await doc.save('document');
			},
		});
	};

	return (
		<div>
			<div ref={invoiceRef} style={{ width: 580, marginTop: 24, marginLeft: 80, marginRight: 60, fontFamily: 'Arial' }}>
				<h1 style={{ marginTop: 12, marginBottom: 3, textAlign: "center", fontSize: 20, marginBottom: 20 }}><span style={{ borderBottomStyle: "solid", borderBottomWidth: 1.25 }}>Vehicle Bill of Sale</span></h1>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}>For the Exact Sales Amount indicated below, I the Seller, do hereby sell and transfer ownership of the Vehicle described below to the Buyer, acknowledge full recei of payment, certify that I have the authority to sell it, warrant the Vehicle to be free of any liens or encumbrances, and certify that all information given is true and correct to the best of my knowledge.</p>
				<h2 style={{ marginTop: 12, marginBottom: 3, borderBottomWidth: 1, fontSize: 12 }}>Vehicle Information</h2>
				<table cellspacing="0" cellpadding="0" style={{ borderWidth: 0.75, borderStyle: "solid", borderCollapse: "collapse", width: "100%" }}>
					<tbody>
						<tr style={{ height: 28.8 }}>
							<td colspan="2" style={{ width: 210.25, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>VEHICLE IDENTIFICATION NUMBER (VIN#)</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{carInfo?.vin}&nbsp;</strong></p>
							</td>
							<td style={{ width: 125.85, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>ENGINE NUMBER (if applicable)</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{carInfo?.engine}&nbsp;</strong></p>
							</td>
							<td style={{ width: 108.2, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>LOT #</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{carInfo?.lot}&nbsp;</strong></p>
							</td>
						</tr>
						<tr style={{ height: 28.8 }}>
							<td style={{ width: 75.25, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>YEAR</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{carInfo?.year}&nbsp;</strong></p>
							</td>
							<td style={{ width: 75.25, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>MAKE</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{carInfo?.make}&nbsp;</strong></p>
							</td>
							<td style={{ width: 75.25, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>MODEL</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{carInfo?.model}&nbsp;</strong></p>
							</td>
							<td style={{ width: 108.2, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>BODY STYLE (2 Dr, 4 Dr, etc)</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{carInfo?.doors} Dr&nbsp;</strong></p>
							</td>
						</tr>
						<tr style={{ height: 28.8 }}>
							<td colspan="2" style={{ width: 210.25, borderRightStyle: "solid", borderRightWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>ODOMETER READING (<strong>Miles</strong>)</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{carInfo?.mileage} mi&nbsp;</strong></p>
							</td>
							<td style={{ width: 125.85, borderRightStyle: "solid", borderRightWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>SALE DATE</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{new Date(carInfo?.updatedAt).toDateString()}&nbsp;</strong></p>
							</td>
							<td style={{ width: 108.2, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>EXACT SALES AMOUNT</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{currencyFormater(carInfo?.bidPrice)} $</strong><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong><strong>(USD)</strong></p>
							</td>
						</tr>
					</tbody>
				</table>
				<h2 style={{ marginTop: 12, marginBottom: 3, borderBottomWidth: 0.75, borderBottomStyle: "solid", paddingBottom: 1, fontSize: 12 }}>Conditions and Warranty</h2>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}>The Seller has no knowledge of any hidden defects in and to the Vehicle, and believes to the best of the Seller's knowledge that the Vehicle is being sold in good operating condition &quot;AS-IS,&quot; meaning that there is no warranty for any defects and that all repairs are the responsibility of the Buyer.</p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}>&nbsp;</p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}>Seller allows the Buyer ______ days to have the Vehicle inspected by an independent mechanic, and agrees to cancel the sale if the inspection is unsatisfactory to the Buyer.</p>
				<h2 style={{ marginTop: 12, marginBottom: 3, borderBottomWidth: 0.75, borderBottomStyle: "solid", paddingBottom: 1, fontSize: 12 }}>Odometer Discloser Statement</h2>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 8 }}><strong>Federal and state law requires the Seller of the Vehicle to state the odometer mileage upon the transfer of ownership. Failure to complete or a false statement may result in fines and/or imprisonment.</strong></p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}>&nbsp;</p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}>I the Seller, hereby certify to the best of my knowledge that the ODOMETER READING listed under the Vehicle information above was not altered, set back, or disconnected while in the Seller's possession, and the Seller has no knowledge of anyone doing so, and is (check one of the following):</p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}>&nbsp;</p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 14 }}>[&nbsp;&nbsp;&nbsp; ]<span style={{ fontSize: 10 }}>&nbsp;&nbsp;</span><span style={{ fontSize: 10 }}>THE ACTUAL MILEAGE</span></p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 14 }}>[&nbsp;&nbsp;&nbsp; ]<span style={{ fontSize: 10 }}>&nbsp;&nbsp;</span><span style={{ fontSize: 10 }}>MILEAGE IN EXCESS OF MECHANICAL LIMITS</span></p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 14 }}>[&nbsp;&nbsp;&nbsp; ]<span style={{ fontSize: 10 }}>&nbsp;&nbsp;</span><span style={{ fontSize: 10 }}>NOT THE ACTUAL MILEAGE.&nbsp;</span><strong><span style={{ fontSize: 10 }}>WARNING!</span></strong><span style={{ fontSize: 10 }}>&nbsp;ODOMETER DISCREPANCY</span></p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}>&nbsp;</p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}>&nbsp;</p>
				<table cellspacing="0" cellpadding="0" style={{ borderCollapse: "collapse", width: "100%" }}>
					<tbody>
						<tr style={{ height: 28.8 }}>
							<td style={{ width: 192.25, borderStyle: "solid", borderWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}><strong>SELLER'S SIGNATURE</strong></p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>x&nbsp;</strong></p>
							</td>
							<td colspan="2" style={{ width: 168.5, borderTopStyle: "solid", borderTopWidth: 0.75, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>SELLER'S PRINTED NAME</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{sellerInfo?.firstName} {sellerInfo?.lastName}&nbsp;</strong></p>
							</td>
							<td colspan="2" style={{ width: 168.5, borderTopStyle: "solid", borderTopWidth: 0.75, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>DATE</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{new Date(carInfo?.invoiceSent).toDateString()}&nbsp;</strong></p>
							</td>
						</tr>
						<tr style={{ height: 28.8 }}>
							<td style={{ width: 192.25, borderLeftStyle: "solid", borderLeftWidth: 0.75, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>SELLER'S ADDRESS</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{sellerAddr?.streetLine}&nbsp;</strong></p>
							</td>
							<td style={{ width: 132.5, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>CITY</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{sellerAddr?.city}&nbsp;</strong></p>
							</td>
							<td colspan="2" style={{ width: 51.5, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>STATE</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{sellerAddr?.state}&nbsp;</strong></p>
							</td>
							<td style={{ width: 56.55, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>ZIP</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{sellerInfo?.zipCode}&nbsp;</strong></p>
							</td>
						</tr>
						<tr style={{ height: 0 }}>
							<td style={{ width: 198.4 }}><br /></td>
							<td style={{ width: 140.4 }}><br /></td>
							<td style={{ width: 35.55 }}><br /></td>
							<td style={{ width: 26.5 }}><br /></td>
							<td style={{ width: 66.65 }}><br /></td>
						</tr>
					</tbody>
				</table>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}>&nbsp;</p>
				<table cellspacing="0" cellpadding="0" style={{ borderCollapse: "collapse", width: "100%" }}>
					<tbody>
						<tr style={{ height: 28.8 }}>
							<td style={{ width: 192.25, borderStyle: "solid", borderWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}><strong>BUYER'S SIGNATURE</strong></p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>x&nbsp;</strong></p>
							</td>
							<td colspan="2" style={{ width: 168.5, borderTopStyle: "solid", borderTopWidth: 0.75, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>BUYER'S PRINTED NAME</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{carInfo?.User?.firstName} {carInfo?.User?.lastName}&nbsp;</strong></p>
							</td>
							<td colspan="2" style={{ width: 83.55, borderTopStyle: "solid", borderTopWidth: 0.75, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>DATE</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{new Date(carInfo?.invoiceSent).toDateString()}&nbsp;</strong></p>
							</td>
						</tr>
						<tr style={{ height: 28.8 }}>
							<td style={{ width: 192.25, borderLeftStyle: "solid", borderLeftWidth: 0.75, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>BUYER'S ADDRESS</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{buyerAddr?.streetLine}&nbsp;</strong></p>
							</td>
							<td style={{ width: 132.5, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>CITY</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{buyerAddr?.city}&nbsp;</strong></p>
							</td>
							<td colspan="2" style={{ width: 51.5, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>STATE</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{buyerAddr?.state}&nbsp;</strong></p>
							</td>
							<td style={{ width: 56.55, borderRightStyle: "solid", borderRightWidth: 0.75, borderBottomStyle: "solid", borderBottomWidth: 0.75, paddingTop: 1.8, paddingRight: 5.38, paddingLeft: 5.38, verticalAlign: "top" }}>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 2, fontSize: 8 }}>ZIP</p>
								<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 10 }}><strong>{carInfo?.User?.zipCode}&nbsp;</strong></p>
							</td>
						</tr>
						<tr style={{ height: 0 }}>
							<td style={{ width: 198.45 }}><br /></td>
							<td style={{ width: 140.35 }}><br /></td>
							<td style={{ width: 35.55 }}><br /></td>
							<td style={{ width: 26.5 }}><br /></td>
							<td style={{ width: 66.65 }}><br /></td>
						</tr>
					</tbody>
				</table>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}>&nbsp;</p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}>SWORN TO AND SUBSCRIBED BEFORE ME, this the ______ day of<span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span>__________________, 20_____.</p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}>&nbsp;</p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span>_______________________________</p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0 }}><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span><span style={{ width: 36, display: "inline-block" }}>&nbsp;</span>NOTARY PUBLIC</p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 8 }}>&nbsp;</p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 8 }}>&nbsp;</p>
				<p style={{ maxWidth: 525, fontSize: 11, marginTop: 0, marginBottom: 0, fontSize: 8 }}>Contact your state's motor vehicle department to find out if there are special requirements for the sale and transfer of your vehicle.</p>
			</div>
			<Group justify="end" mt="xl" style={{ position: "absolute", right: "20px", bottom: "10px" }}>
				<Button radius="xl" onClick={handleGeneratePdf} disabled={(!sellerInfo && !carInfo && !sellerAddr && !buyerAddr)}>Download PDF</Button>
			</Group>
		</div>
	);
};