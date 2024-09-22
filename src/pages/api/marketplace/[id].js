import { apiHandler, userCarRepo } from '@/helpers/api';
import { updateInfo } from './update';

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete,
});

async function getById(req, res) {
   
    const car = await userCarRepo.getCarById(req.query.userId,req.query.id);
    if (!car) return res.status(200).json({status:false});;

    return res.status(200).json({car:car,status:true});
}

async function update(req, res) {
    await updateInfo(req.query.id, req.body);
    return res.status(200).json({});
}

async function _delete(req, res) {
    await userCarRepo.delete(req.query.id);
    return res.status(200).json({});
}