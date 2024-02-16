import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import 'dotenv/config';
import { S3Client } from '@aws-sdk/client-s3';
import { ServerError } from '../../types/classes/Errors';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { Conditions } from '@aws-sdk/s3-presigned-post/dist-types/types';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
class S3 {
  constructor(private s3Client: S3Client) {}

  public getImageUrl = async (bucket: string, key: string) => {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    return url;
  };

  public getImage = async (bucket: string, key: string) => {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await this.s3Client.send(command);
    const uint8Arr = await response?.Body?.transformToByteArray();
    if (!uint8Arr) throw new ServerError('cant get image from s3');
    const buffer = Buffer.from(uint8Arr);
    return buffer;
  };

  public uploadImage = async (buffer: Buffer, bucket: string, key: string, contentType: string) => {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    await this.s3Client.send(command);
  };

  public presignedPost = async (expires: number, key: string, bucket: string, contentType: string) => {
    const options = {
      Fields: { 'Content-Type': contentType },
      Bucket: bucket,
      Expires: expires,
      Key: key,
      Conditions: [
        ['starts-with', '$Content-Type', 'image/'],
        ['content-length-range', 0, 10485760],
      ] as Conditions[],
    };
    return await createPresignedPost(this.s3Client, options);
  };
}

export default S3;
