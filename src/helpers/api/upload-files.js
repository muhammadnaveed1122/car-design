import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-client";
import sharp from "sharp";
import fs from "fs";

export const uploadFilesToAWS = async (files, folderPath) => {
  const newFileNames = [];
  for (const file of files) {
    try {
      const rawData = fs.readFileSync(file.filepath);
      const timestamp = Date.now();
      const newFilename = `${folderPath}/${timestamp}_${file.originalFilename}`;
      const thumbFilename = `${folderPath}/thumb_${timestamp}_${file.originalFilename}`;
      const compressedData = await sharp(rawData)
        .resize({ fit: "inside", width: 800 }) // Resize the image to a maximum width of 800px
        .toBuffer();
      const params = {
        Bucket: process.env.SPACES_BUCKET_NAME,
        Key: newFilename,
        Body: rawData,
        ACL: "public-read",
        ContentType: "image/jpeg",
      };
      const uploadResult = await uploadFileToSpace(params);
      if (uploadResult) {
        const name =
          "https://spaces1234.nyc3.cdn.digitaloceanspaces.com/" + newFilename;
        newFileNames.push(name);
      }
    } catch (error) {
      console.error("Error uploading to AWS S3:", error);
    }
  }
  return newFileNames;
};
async function uploadFileToSpace(params) {
  try {
    await s3Client.send(new PutObjectCommand(params));
    return true;
  } catch (error) {
    return false;
  }
}
