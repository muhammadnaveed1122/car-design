import formidable from 'formidable';
import { apiHandler, carsRepo } from '@/helpers/api';
import { uploadFilesToAWS } from '@/helpers/api';
import { uploadPdf } from '@/helpers/api/upload-pdf';

export const config = {
    api: {
        bodyParser: false
    }
};

export default apiHandler({
    post: updateInfo
});

async function updateInfo(req, res) {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        console.error('Error parsing form:', err);

        if (err) {
            console.error('Error parsing form:', err);
            res.status(500).json({ message: 'Error parsing form.' });
            return;
        }

        const jsonFields = {};
        for (const key in fields) {
            if (fields.hasOwnProperty(key)) {

                jsonFields[key] = (fields[key][0] === "null" ? null : fields[key][0]);
            }
        }
        jsonFields['referal'] = jsonFields.hasOwnProperty('referal') ? jsonFields['referal'] : null;

        const thumbSize = {
            width: 320,
            height: 240
        };
        for (const key in files) {
            if (key === 'pdf') {
                const uploaded = await uploadPdf(files[key], "pdf", thumbSize);
                jsonFields[key] = uploaded
            } else {
                let prevFields = [];
                if (jsonFields.hasOwnProperty(key)) {
                    prevFields = JSON.parse(jsonFields[key]);
                }
                const uploaded = await uploadFilesToAWS(files[key], "cars", thumbSize);
                jsonFields[key] = JSON.stringify([
                    ...prevFields,
                    ...uploaded
                ]);
            }
        }
        try {
            jsonFields.companyImage = Array.isArray(JSON.parse(jsonFields.companyImage)) ?
                JSON.parse(jsonFields?.companyImage)[0] : jsonFields?.companyImage;
        }
        catch (e) {

            jsonFields.companyImage = jsonFields.companyImage
        }

        jsonFields.autoBid = jsonFields.autoBid ? JSON.parse(jsonFields.autoBid) : jsonFields.autoBid
        try {
            const carId = jsonFields.id;
            await carsRepo.update(carId, jsonFields);
        } catch (e) {
            res.status(500).json({ message: e });
        } finally {
            res.status(200).json(jsonFields);
        }
    });
}
