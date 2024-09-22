import formidable from 'formidable';
import { apiHandler, usersRepo } from '@/helpers/api';
import { uploadFilesToAWS } from '@/helpers/api';

export const config = {
    api: {
        bodyParser: false
    }
};

export default apiHandler({
    post: register
});

async function register(req, res) {
    const form = formidable({ multiples: false });
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
                jsonFields[key] = fields[key][0]; // Assuming each field has a single value
            }
        }

        if (!files) {
            res.status(400).json({ message: 'No file found in the request.' });
            return;
        }
        try {
            await usersRepo.create(jsonFields, true);
        } catch (e) {
            res.status(500).json({ message: e });
            return;
        }
        for (const key in files) {
            const uploaded = await uploadFilesToAWS(files[key], "users")
            jsonFields[key] = uploaded[0]

        }
        try {
            await usersRepo.create(jsonFields);
        } catch (e) {
            res.status(500).json({ message: e });
        } finally {
            res.status(200).json({ message: 'User saved to the database successfully.' });
        }
    });
}
