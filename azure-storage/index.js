const express = require("express");
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

const PORT = process.env.PORT;
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;

function createBlobService() {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    STORAGE_ACCOUNT_NAME,
    STORAGE_ACCESS_KEY
  );
  const blobService = new BlobServiceClient(
    `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    sharedKeyCredential
  );
  return blobService;
}

const app = express();

app.listen(PORT, () => console.log("Storage service online."));
