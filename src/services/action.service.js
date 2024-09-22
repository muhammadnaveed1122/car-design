import { fetchWrapper } from '@/helpers';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/action`;

export const actionService = {
    bid,
    buy,
    myAuctions,
};

async function bid(params) {
    return await fetchWrapper.post(`${baseUrl}/bid`, params);
}

async function buy(params) {
    return await fetchWrapper.post(`${baseUrl}/buy`, params);
}

async function myAuctions(params) {
    return await fetchWrapper.post(`${baseUrl}/myauctions`, params)
}