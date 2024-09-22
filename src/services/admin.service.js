import { fetchWrapper } from '@/helpers';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admin`;


export const adminService = {
    getAllAdmin,
    createAdmin,

};
async function getAllAdmin(currentPage) {
    return await fetchWrapper.get(`${baseUrl}?page=${currentPage}`);
}
async function createAdmin(admin) {
    return await fetchWrapper.post(`${baseUrl}/create`, admin, false);
}