import { fetchWrapper } from '@/helpers';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/cars`;

export const carService = {
    getAll,
    getAllCusmtoer,
    getMakesCount,
    getById,
    getBySlug,
    create,
    update,
    updateInfo,
    delete: _delete,
    filter,
    getUniqueValues,
    sold,
    demoCars,
    updateSteps,
    getLatestByActivities,
    updateTrash,
    getAllTrashedCustomer,
    duplicateCar,
    updateWinBox,
    getAllPendingCars
};

async function getAll() {
    return await fetchWrapper.get(baseUrl);
}
async function getAllPendingCars(currentPage) {
    return await fetchWrapper.get(`${baseUrl}/pending?page=${currentPage}`);

}
async function getAllCusmtoer(currentPage) {
    return await fetchWrapper.get(`${baseUrl}/customer?page=${currentPage}`);
}

async function updateSteps(id, params) {
    const response = await fetchWrapper.put(`${baseUrl}/${id}`, params);
    return response
}

async function updateWinBox(id) {
    const response = await fetchWrapper.put(`${baseUrl}/win/${id}`);
    return response
}

async function getMakesCount() {
    return await fetchWrapper.get(`${baseUrl}/makes`);
}

async function getById(id) {
    return await fetchWrapper.get(`${baseUrl}/${id}`);
}
async function create(params) {
    return await fetchWrapper.post(`${baseUrl}/create`, params, false);
}

async function duplicateCar(params) {
    return await fetchWrapper.post(`${baseUrl}/duplicate`, params, false);
}
async function update(id, params) {
    return  await fetchWrapper.put(`${baseUrl}/${id}`, params);
}

async function updateInfo(params) {
    return await fetchWrapper.post(`${baseUrl}/update`, params, false);
}

async function getLatestByActivities(id) {
    return await fetchWrapper.get(`${baseUrl}/latest/${id}`);
}
// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
    return await fetchWrapper.delete(`${baseUrl}/${id}`);
}

async function filter(params) {
    return await fetchWrapper.post(`${baseUrl}/filter`, params);
}

async function getUniqueValues(params) {
    return await fetchWrapper.post(`${baseUrl}/unique`, params);
}

async function sold(params) {
    return await fetchWrapper.post(`${baseUrl}/sold`, params);
}

async function demoCars(params) {
    return await fetchWrapper.post(`${baseUrl}/market`, params);
}

async function updateTrash(id) {
    const response = await fetchWrapper.put(`${baseUrl}/trash/${id}`);
    return response
}

async function getAllTrashedCustomer(currentPage) {
    return await fetchWrapper.get(`${baseUrl}/trash?page=${currentPage}`);
}
async function getBySlug(slug) {
    return await fetchWrapper.get(`${baseUrl}/slug/${slug}`);
}