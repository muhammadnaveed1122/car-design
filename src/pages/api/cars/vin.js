import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
    post: getVinData
});
const CryptoJS = require('crypto-js');



async function getVinData(req, res) {

    const controlSum = CryptoJS.SHA1(`${req.body.vin}|${id}|${apiKey}|${secretKey}`).toString(CryptoJS.enc.Hex).substring(0, 10);
    const url = `${apiPrefix}/${apiKey}/${controlSum}/decode/${vin}.json`;
    fetch(url)
        .then(response => response.json())
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}