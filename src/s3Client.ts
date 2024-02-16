import { S3Client } from '@aws-sdk/client-s3';
import 'dotenv/config';
const { REGION, AWS_ACCESS_KEY_, AWS_SECRET_KEY_ } = process.env;
if (!(REGION && AWS_ACCESS_KEY_ && AWS_SECRET_KEY_)) {
  throw new Error('env is not full');
}

export const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_,
    secretAccessKey: AWS_SECRET_KEY_,
  },
});
