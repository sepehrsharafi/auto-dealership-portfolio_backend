import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { SDKSECRETS } from "../core/secrets/index.js";

const s3Client = new S3Client({
  endpoint: "https://s3.ir-thr-at1.arvanstorage.ir",
  credentials: {
    accessKeyId: SDKSECRETS.sdkKey,
    secretAccessKey: SDKSECRETS.sdkSecret,
  },
  region: "default",
  forcePathStyle: true,
});

const uploadFileToS3 = async (file, carID, index) => {
  const params = {
    Bucket: SDKSECRETS.storageName,
    Key: `uploads/${carID}/${index + 1}.${file.mimetype.split("/")[1]}`,
    Body: file.buffer,
    ACL: "public-read",
  };

  // Upload the file
  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const fileUrl = `https://${params.Bucket}.s3.ir-thr-at1.arvanstorage.ir/${params.Key}`;
  return fileUrl;
};

export default uploadFileToS3;
