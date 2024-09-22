import formidable from 'formidable';
import { apiHandler, userCarRepo } from '@/helpers/api';
import { uploadFilesToAWS } from '@/helpers/api';
import { uploadPdf } from '@/helpers/api/upload-pdf';

export const config = {
    api: {
        bodyParser: false
    }
};

export default apiHandler({
    put: updateInfo
});

export async function updateInfo(req, res) {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        console.log("🚀 ~ form.parse ~ files:", files)
        if (err) {
            console.error('Error parsing form:', err);
            res.status(500).json({ message: 'Error parsing form.' });
            return;
        }

        const jsonFields = {};
        for (const key in fields) {
            if (fields.hasOwnProperty(key)) {
                jsonFields[key] = fields[key][0] === 'null' ? null : fields[key][0];
            }
        }

        const interiorImages = [];
        const exteriorImages = [];
        const engineImages=[];
        for (const key in files) {
            console.log("🚀 ~ form.parse ~ key:", key)
            if (key === 'pdf') {
                const uploaded = await uploadPdf(files[key], "pdf");
                jsonFields[key] = uploaded;
            } else if (key.startsWith('interior')) {
                const uploaded = await uploadFilesToAWS(files[key], "cars");
                interiorImages.push(...uploaded);
            }else if (key.startsWith('engine')) {
                const uploaded = await uploadFilesToAWS(files[key], "cars");
                engineImages.push(...uploaded);
            } else if (key.startsWith('exterior')) {
                const uploaded = await uploadFilesToAWS(files[key], "cars");
                exteriorImages.push(...uploaded);
            } else {
                let prevFields = [];
                if (jsonFields.hasOwnProperty(key)) {
                    try {
                        prevFields = JSON.parse(jsonFields[key]);
                    } catch (e) {
                        console.error(`Error parsing previous fields for ${key}:`, e);
                    }
                }
                const uploaded = await uploadFilesToAWS(files[key], "cars");
                jsonFields[key] = JSON.stringify([
                    ...prevFields,
                    ...uploaded
                ]);
            }
        }
        try {
            jsonFields.interiorImages = JSON.stringify([
                ...(Array.isArray(JSON.parse(jsonFields.interiorImages)) ? JSON.parse(jsonFields.interiorImages) : []),
                ...interiorImages
            ]);
        } catch (error) {
            console.error('Invalid JSON in interiorImages:', jsonFields.interiorImages);
            // jsonFields.interiorImages = JSON.stringify([...interiorImages]);
        }
        
        try {
            jsonFields.engineImages = JSON.stringify([
                ...(Array.isArray(JSON.parse(jsonFields.engineImages)) ? JSON.parse(jsonFields.engineImages) : []),
                ...engineImages
            ]);
        } catch (error) {
            console.error('Invalid JSON in engineImages:', jsonFields.engineImages);
            // jsonFields.engineImages = JSON.stringify([...engineImages]);
        }
        
        try {
            jsonFields.exteriorImages = JSON.stringify([
                ...(Array.isArray(JSON.parse(jsonFields.exteriorImages)) ? JSON.parse(jsonFields.exteriorImages) : []),
                ...exteriorImages
            ]);
        } catch (error) {
            console.error('Invalid JSON in exteriorImages:', jsonFields.exteriorImages);
            // jsonFields.exteriorImages = JSON.stringify([...exteriorImages]);
        }
        

        try {
            jsonFields.companyImage = Array.isArray(JSON.parse(jsonFields.companyImage)) ?
                JSON.parse(jsonFields.companyImage)[0] : jsonFields.companyImage;
        } catch (e) {
            jsonFields.companyImage = jsonFields.companyImage;
        }

        try {
            const carId = jsonFields.id;
            // console.log("🚀 ~ form.parse ~ jsonFields:", jsonFields)
            await userCarRepo.update(carId, jsonFields);
        } catch (e) {
            res.status(500).json({ message: e.message });
            return;
        }

        res.status(200).json(jsonFields);
    });
}
