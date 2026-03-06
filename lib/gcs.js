import { Storage } from '@google-cloud/storage';

function getStorage() {
  const base64 = process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_BASE64;
  if (!base64) {
    throw new Error('GOOGLE_CLOUD_SERVICE_ACCOUNT_BASE64 is not set');
  }
  const credentials = JSON.parse(
    Buffer.from(base64, 'base64').toString()
  );
  return new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials,
  });
}

const bucketName = process.env.GCS_BUCKET_NAME;

export async function uploadToGCS(file, folder = 'uploads') {
  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  if (!bucketName) {
    throw new Error('GCS_BUCKET_NAME is not set');
  }
  const filename = `${folder}/${Date.now()}-${file.name}`;
  const blob = bucket.file(filename);

  await blob.save(file.buffer, {
    metadata: { contentType: file.mimetype },
  });

  await blob.makePublic();
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

export async function deleteFromGCS(url) {
  if (!url || !bucketName) return;
  const prefix = `https://storage.googleapis.com/${bucketName}/`;
  if (!url.startsWith(prefix)) return;
  const filename = url.slice(prefix.length);
  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  await bucket.file(filename).delete();
}
