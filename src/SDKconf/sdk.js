import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
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

const uploadFileToS3 = async (file, carID) => {
  // Remove spaces and slashes, and replace with hyphens
  const formattedFileName = file.originalname
    .replace(/\s+/g, "-")
    .replace(/\//g, "-");

  const params = {
    Bucket: SDKSECRETS.storageName,
    Key: `uploads/${carID}/${formattedFileName}`,
    Body: file.buffer,
    ACL: "public-read",
  };

  // Upload the file
  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const fileUrl = `https://${params.Bucket}.s3.ir-thr-at1.arvanstorage.ir/${params.Key}`;
  return fileUrl;
};
const deleteFilesInDirectory = async (carID, urls) => {
  const bucketName = SDKSECRETS.storageName;
  const prefix = `uploads/${carID}/`;

  const keysToKeep = urls.map((url) => {
    return url.replace(
      `https://${bucketName}.s3.ir-thr-at1.arvanstorage.ir/`,
      ""
    );
  });

  const listParams = {
    Bucket: bucketName,
    Prefix: prefix,
  };

  const listCommand = new ListObjectsV2Command(listParams);
  const listResponse = await s3Client.send(listCommand);

  if (!listResponse.Contents || listResponse.Contents.length === 0) {
    console.log(`No files found in directory: ${prefix}`);
    return;
  }

  const objectsToDelete = listResponse.Contents.filter((object) => {
    return !keysToKeep.includes(object.Key);
  }).map((object) => ({
    Key: object.Key,
  }));

  if (objectsToDelete.length === 0) {
    console.log("No files to delete. All files are in the provided URLs.");
    return;
  }

  const deleteParams = {
    Bucket: bucketName,
    Delete: {
      Objects: objectsToDelete,
    },
  };

  const deleteCommand = new DeleteObjectsCommand(deleteParams);
  const deleteResponse = await s3Client.send(deleteCommand);

  console.log(
    `Deleted ${deleteResponse.Deleted.length} files from directory: ${prefix}`
  );
  return deleteResponse;
};
const deleteFolderByCarID = async (carID) => {
  const bucketName = SDKSECRETS.storageName;
  const prefix = `uploads/${carID}/`;

  const listParams = {
    Bucket: bucketName,
    Prefix: prefix,
  };

  const listCommand = new ListObjectsV2Command(listParams);
  const listResponse = await s3Client.send(listCommand);

  if (!listResponse.Contents || listResponse.Contents.length === 0) {
    console.log(`No files found in directory: ${prefix}`);
    return { message: `No files found in directory: ${prefix}` };
  }

  const objectsToDelete = listResponse.Contents.map((object) => ({
    Key: object.Key,
  }));

  const deleteParams = {
    Bucket: bucketName,
    Delete: {
      Objects: objectsToDelete,
    },
  };

  const deleteCommand = new DeleteObjectsCommand(deleteParams);
  const deleteResponse = await s3Client.send(deleteCommand);

  console.log(
    `Deleted ${deleteResponse.Deleted.length} files from directory: ${prefix}`
  );
  return deleteResponse;
};
export { uploadFileToS3, deleteFilesInDirectory, deleteFolderByCarID };
