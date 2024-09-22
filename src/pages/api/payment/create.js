import { apiHandler, paymentRepo } from '@/helpers/api';

export default apiHandler({
    post: create
});

async function create(req, res) {
   const response= await paymentRepo.create(req.body);
    return res.status(200).json({ message: "Payment Account created successfully" ,data:response});
}
