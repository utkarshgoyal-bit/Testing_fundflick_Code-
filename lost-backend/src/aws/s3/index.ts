import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import Logger from '../../lib/logger';
// Function to upload file to S3 and return the original URL
export async function uploadFileToS3(filePath: string, keyName: string, contentType: string) {
  const s3ClientConfig = {
    region: process.env.AWS_REGION, // AWS region (make sure this is set)
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '', // AWS Access Key
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '', // AWS Secret Key
    },
  };
  const s3Client = new S3(s3ClientConfig);
  const fileStream = fs.createReadStream(filePath);
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch (err) {
    Logger.error('File not found or no read access:', err);
    throw new Error('File does not exist or cannot be read.');
  }

  // Define the S3 upload parameters
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || '', // Your bucket name
    Key: 'customerFile/file-' + keyName + '.' + contentType.split('/')[1],
    Body: fileStream, // The file content (stream in this case)
    ContentType: 'application/octet-stream', // MIME type (can be adjusted based on the file type)
  };

  try {
    // Upload the file using putObject
    await s3Client.putObject(params).promise();
    console.log('Upload successful');

    // Properly encode the filename/key to ensure URL is formed correctly
    const encodedKey = encodeURIComponent(params.Key);

    // Construct the original S3 URL with the encoded key
    const originalUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodedKey}`;
    fs.unlinkSync(filePath);
    return originalUrl; // Return only the original URL
  } catch (err) {
    Logger.error('Error uploading file:', err);
    throw new Error('Failed to upload the file.');
  }
}

export const generateSignedUrl = async (fileName: string) => {
  const filePath = decodeURIComponent(fileName.split('.com/')[1]);
  const s3ClientConfig = {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  };
  const s3Client = new S3(s3ClientConfig);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || '',
    Key: filePath,
    Expires: 60 * 5,
  };

  return s3Client.getSignedUrl('getObject', params);
};
