import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-client"
import fs from 'fs';
export const uploadPdf = async (file, folderPath) => {
    let newFileNames
    file = file[0]
    try {
        const rawData = fs.readFileSync(file.filepath);
        const timestamp = Date.now();
        const newFilename = `${folderPath}/${timestamp}_${file.originalFilename}`;

        const params = {
            Bucket: process.env.SPACES_BUCKET_NAME,
            Key: newFilename,
            Body: rawData,
            ACL: 'public-read',
            ContentType: 'application/pdf',
        };
        const uploadResult = await uploadFileToSpace(params);
        if (uploadResult) {
            const name = "https://estepautodealer.nyc3.cdn.digitaloceanspaces.com/" + newFilename
            newFileNames = name
        }
    } catch (error) {
        console.error('Error uploading to AWS S3:', error);
    }

    return newFileNames
}
async function uploadFileToSpace(params) {
    try {
        await s3Client.send(new PutObjectCommand(params));
        return true;
    } catch (error) {
        return false
    }
}