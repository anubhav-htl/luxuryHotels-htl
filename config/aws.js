import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const listObjects = async () => { 
  try {
    const command = new ListObjectsV2Command({ Bucket: process.env.S3_BUCKET_NAME });
    const response = await s3Client.send(command);
    console.log('Objects in S3 bucket:', response.Contents);
  } catch (error) {
    console.error('Error listing objects:', error);
  }
}

listObjects();