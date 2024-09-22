import formidable from 'formidable';
import { apiHandler, carsRepo } from '@/helpers/api';
import { uploadFilesToAWS } from '@/helpers/api';
import { uploadPdf } from '@/helpers/api/upload-pdf';
import { createFakeBidderProfile } from '@/constants/data';

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
        console.error('Error parsing form:', err);

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

        const thumbSize = {
            width: 320,
            height: 240
        };


        for (const key in files) {
            if (key === 'pdf') {
                const uploaded = await uploadPdf(files[key], "pdf", thumbSize);
                jsonFields[key] = uploaded
            } else {
                const uploaded = await uploadFilesToAWS(files[key], "cars", thumbSize);
                jsonFields[key] = JSON.stringify(uploaded);
            }
        }

        
        try {
            jsonFields.companyImage = Array.isArray(JSON.parse(jsonFields.companyImage)) ?
                JSON.parse(jsonFields?.companyImage)[0] : jsonFields?.companyImage;
        }
        catch (e) {

            jsonFields.companyImage = jsonFields.companyImage
        }

        let slug = `${jsonFields.make.replace(/\s/g, '')}-${jsonFields.model.replace(/\s/g, '')}-${jsonFields.year}-${genRanHex(5)}`;
        slug = slug.toLowerCase()
        jsonFields.status ==="LIVE" && (jsonFields.autoBid = createFakeBidderProfile(jsonFields.bidPrice ,true))
        
        try {
            jsonFields.slug = slug
            jsonFields.id = await carsRepo.create(jsonFields);
            jsonFields.status = 'NEW';
        } catch (e) {
            res.status(500).json({ message: e });
        } finally {
            res.status(200).json(jsonFields);
        }
    });
}

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

