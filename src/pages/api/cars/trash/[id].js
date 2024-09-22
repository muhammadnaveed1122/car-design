import { apiHandler, carsRepo } from '@/helpers/api';

export default apiHandler({
    put:updateTrash
});



async function updateTrash(req,res){
    await carsRepo.updateTrash(req.query.id, req.body);
    return res.status(200).json({ message: "Customer has been updated successfully." });
}