import { apiHandler, accountsRepo } from '@/helpers/api';

export default apiHandler({
    post: create
});

async function create(req, res) {
    await accountsRepo.create(req.body);
    return res.status(200).json({ message: "Account created successfully" });
}
