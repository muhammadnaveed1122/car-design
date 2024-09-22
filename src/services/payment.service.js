import { fetchWrapper } from '@/helpers';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/payment`;

export const paymentService = {
    create,
    update,
    delete: _delete,
    getAllAccounts,
    getById
};

async function create(params) {
    return await fetchWrapper.post(`${baseUrl}/create`, params);
}

async function update(id, params) {
    return await fetchWrapper.put(`${baseUrl}/${id}`, params);
}
async function _delete(id) {
    return await fetchWrapper.delete(`${baseUrl}/${id}`);
}
async function getAllAccounts(currentPage) {
    return await fetchWrapper.get(`${baseUrl}?page=${currentPage}`);
}

async function getById(id) {
    return await fetchWrapper.get(`${baseUrl}/${id}`);
}