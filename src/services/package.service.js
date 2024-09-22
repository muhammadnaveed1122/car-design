import { fetchWrapper } from '@/helpers';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/package`;
export const packageService = {
    create,
    getPackageByUserId
};
async function create(data) {
    return await fetchWrapper.post(`${baseUrl}/create`, data);
}
async function getPackageByUserId(userId){
    return await fetchWrapper.get(`${baseUrl}/create?userId=${userId}`);

}