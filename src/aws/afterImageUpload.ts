import { S3Event, Context, Callback } from 'aws-lambda';
import 'dotenv/config';
import ImagesRepository from '../repositories/Images';
import { SelfiesRepository } from '../repositories/Selfies';
import { ClientsRepository } from '../repositories/Clients';
import { db } from '../db/db';
import EditImagesService from '../services/EditImages';
import S3 from '../services/s3';
import fs from 'fs';
import { s3Client } from '../s3Client';
const watermarkPath = './watermark.svg';
const watermarkFile = fs.readFileSync(watermarkPath);
const imagesRepository = new ImagesRepository(db);
const editImagesService = new EditImagesService(watermarkFile);
const selfiesRepository = new SelfiesRepository(db);
const clientsRepository = new ClientsRepository(db);
const s3 = new S3(s3Client);

const { IMAGES_BUCKET, EDITED_IMAGES_BUCKET } = process.env;

exports.handler = async (event: S3Event, context: Context, callback: Callback) => {
  const key = decodeURIComponent(event.Records[0].s3.object.key);
  const slashIndex1 = key.indexOf('/');
  const slashIndex2 = key.indexOf('/', slashIndex1 + 1);
  const begin = key.substring(0, slashIndex1);
  const imageId = key.substring(slashIndex2 + 1);
  try {
    if (begin === 'album') {
      const albumId = key.substring(slashIndex1 + 1, slashIndex2);
      const newImage = { id: imageId, albumId: Number(albumId) };
      await imagesRepository.insertOne(newImage);
      try {
        const buffer = await s3.getImage(IMAGES_BUCKET!, key);
        const watermarked = await editImagesService.putWatermark(buffer);
        await s3.uploadImage(watermarked, EDITED_IMAGES_BUCKET!, `${key}_watermark`, 'image/jpeg');
      } catch (err) {
        await imagesRepository.deleteOne(imageId);
        throw err;
      }
    } else if (begin === 'selfie') {
      const clientId = Number(key.substring(slashIndex1 + 1, slashIndex2));
      const newSelfie = { id: imageId, clientId };
      await db.transaction(async (tx) => {
        await selfiesRepository.insertOne(newSelfie, tx);
        await clientsRepository.updateSelfie(imageId, clientId, tx);
      });
    }
    return {
      statusCode: 200,
    };
  } catch (err) {
    callback(null, {
      body: JSON.stringify(err),
    });
  }
};
