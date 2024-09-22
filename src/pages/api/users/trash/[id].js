import { apiHandler, usersRepo } from '@/helpers/api';

export default apiHandler({
    put:updateTrash
});



async function updateTrash(req,res){
    await usersRepo.updateTrash(req.query.id, req.body);
    return res.status(200).json({ message: "User has been updated successfully." });
}