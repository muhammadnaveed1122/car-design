import { fetchWrapper } from '@/helpers';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/accounts`;

export const accountsService = {
    create,
    update,
    delete: _delete,
    getAllAccounts,
    getAllActiveAccounts
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
async function getAllActiveAccounts() {
    return await fetchWrapper.get(`${baseUrl}/accounts`);
}