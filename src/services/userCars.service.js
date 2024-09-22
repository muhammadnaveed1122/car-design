import { fetchWrapper } from '@/helpers';
import getConfig from 'next/config';
const CryptoJS = require('crypto-js');
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/marketplace`;
const apiPrefix = publicRuntimeConfig.vinApiPrefix
const apiKey = publicRuntimeConfig.vinApiKey
const secretKey = publicRuntimeConfig.vinSecretKey
export const userCarService = {
    create,
    update,
    delete: _delete,
    getAll,
    getUniqueValues,
    updateStatus,
    getSlugData,
    getAllAuction,
    getMarketUniqueValues,
    getCarDetailByVin,
    getById
};
async function getCarDetailByVin(vinNumber) {
    const id = "decode";
    const vin = vinNumber.toUpperCase();
    const controlSum = CryptoJS.SHA1(`${vin}|${id}|${apiKey}|${secretKey}`).toString(CryptoJS.enc.Hex).substring(0, 10);
    const url = `${apiPrefix}/${apiKey}/${controlSum}/decode/${vin}.json`;
    return await fetch(url)

}
async function create(params) {
    return await fetchWrapper.post(`${baseUrl}/create`, params, false);
}
async function getById(userId, id) {
    return await fetchWrapper.get(`${baseUrl}/${id}?userId=${userId}`);
}
async function update(id, params) {
    return await fetchWrapper.put(`${baseUrl}/update`, params, false);
}
async function _delete(id) {
    return await fetchWrapper.delete(`${baseUrl}/${id}`);
}
async function getAll() {
    return await fetchWrapper.get(`${baseUrl}`);
}
async function getUniqueValues(params) {
    return await fetchWrapper.post(`${baseUrl}/unique`, params);
}
async function updateStatus(params) {
    return await fetchWrapper.post(`${baseUrl}/status`, params)
}
async function getSlugData(slug) {
    return await fetchWrapper.get(`${baseUrl}/slug/${slug}`);
}
async function getAllAuction() {
    return await fetchWrapper.get(`${baseUrl}/auction`);
}
async function getMarketUniqueValues(params) {
    return await fetchWrapper.post(`${baseUrl}/market-unique`, params);
}