import { apiHandler, paymentRepo } from '@/helpers/api';

export default apiHandler({
    get: getAll
});

async function getAll(req, res) {
    const paymentAccounts = await paymentRepo.getAllPayments();
    return res.status(200).json(paymentAccounts);
}
