import { apiHandler, packageRepo } from '@/helpers/api';

export default apiHandler({
    post: create,
    get: getPackageByUserId,
});
async function create(req, res) {
    await packageRepo.create(req.body);
    return res.status(200).json({ message: "Package created successfully" });
}
async function getPackageByUserId(req, res) {
    const packageResponse = await packageRepo.getPackageByUserId(req.query.userId);
    if (!packageResponse) {
        return res.status(200).json({ message: "You don't have a package. Please purchase a package to create a car.", packageResponse, status: false });

    } else {
        return res.status(200).json({ packageResponse, status: true });

    }
}
