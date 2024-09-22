import formidable from 'formidable';
import { apiHandler, userCarRepo } from '@/helpers/api';
import { uploadFilesToAWS } from '@/helpers/api';
import { uploadPdf } from '@/helpers/api/upload-pdf';
import { userCarStatus } from '@/constants/data';

export const config = {
    api: {
        bodyParser: false
    }
};

export default apiHandler({
    post: create
});

async function create(req, res) {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            res.status(500).json({ message: 'Error parsing form.' });
            return;
        }

        const jsonFields = {};
        for (const key in fields) {
            if (fields.hasOwnProperty(key)) {
                jsonFields[key] = fields[key][0];
            }
        }

        const interiorImages = [];
        const exteriorImages = [];

        for (const key in files) {
            console.log(key, "keykeykeykey")
            if (key === 'pdf') {
                const uploaded = await uploadPdf(files[key], "pdf");
                jsonFields[key] = uploaded;
            } else if (key.startsWith('interior')) {
                const uploaded = await uploadFilesToAWS(files[key], "cars");
                interiorImages.push(...uploaded);
            } else if (key.startsWith('exterior')) {
                const uploaded = await uploadFilesToAWS(files[key], "cars");
                exteriorImages.push(...uploaded);
            } else {
                const uploaded = await uploadFilesToAWS(files[key], "cars");
                jsonFields[key] = JSON.stringify(uploaded);
            }
        }

        jsonFields.interiorImages = JSON.stringify(interiorImages);
        jsonFields.exteriorImages = JSON.stringify(exteriorImages);

        try {
            jsonFields.companyImage = Array.isArray(JSON.parse(jsonFields.companyImage)) ?
                JSON.parse(jsonFields.companyImage)[0] : jsonFields.companyImage;
        } catch (e) {
            jsonFields.companyImage = jsonFields.companyImage;
        }

        let slug = `${jsonFields.make.replace(/\s/g, '')}-${jsonFields.model.replace(/\s/g, '')}-${jsonFields.year}-${genRanHex(5)}`;
        slug = slug.toLowerCase();

        try {
            jsonFields.slug = slug;
            jsonFields.id = await userCarRepo.create(jsonFields);
            // jsonFields.status = userCarStatus[0];
        } catch (e) {
            console.log("🚀 ~ form.parse ~ e:", e)
            res.status(500).json({ message: e });
            return;
        }

        res.status(200).json(jsonFields);
    });
}

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
