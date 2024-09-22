import { fetchWrapper } from '@/helpers';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/verify`;

export const verifyService = {
  sendBillOfSalesToEmail,
  sendToEmail,
  verifyEmail,
  sendToPhone,
  verifyPhone,
  sendApproval,
  findAddress,
  readTerms,
  sendInvoiceToEmail,
  sendEmailToSupport,
  sendMailStatus,
  sendBidWonEmail,
  sendContactUsEmail
};

async function sendInvoiceToEmail(params) {
  return await fetchWrapper.post(`${baseUrl}/send-invoice`, params, false);
}
async function sendBidWonEmail(params) {
  return await fetchWrapper.post(`${baseUrl}/send-bid-won-email`, params, false);
}
async function sendEmailToSupport(params) {
  return await fetchWrapper.post(`${baseUrl}/send-support`, params, false);
}
async function sendBillOfSalesToEmail(params) {
  return await fetchWrapper.post(`${baseUrl}/send-bill-of-sale`, params, false);
}
async function sendMailStatus (params){
  return await fetchWrapper.post(`${baseUrl}/send-mail-status`, params, false);

}
async function sendToEmail(params) {
  return await fetchWrapper.post(`${baseUrl}/send-email`, params);
}
async function sendContactUsEmail(params) {
  return await fetchWrapper.post(`${baseUrl}/send-contact-us-email`, params);
}
async function verifyEmail(params) {
  return await fetchWrapper.post(`${baseUrl}/check-email`, params);
}

async function sendToPhone(params) {
  return await fetchWrapper.post(`${baseUrl}/send-phone`, params);
}

async function verifyPhone(params) {
  return await fetchWrapper.post(`${baseUrl}/check-phone`, params);
}

async function sendApproval(params) {
  return await fetchWrapper.post(`${baseUrl}/send-approval`, params);
}

async function findAddress(params) {
  return await fetchWrapper.post(`${baseUrl}/find-address`, params);
}

async function readTerms() {
  return await fetchWrapper.post(`${baseUrl}/read-terms`);
}