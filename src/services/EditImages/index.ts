import sharp from './opt/nodejs/node_modules/sharp';
import { ValidationError } from '../../types/classes/Errors';

class EditImagesService {
  private watermark: Buffer;
  constructor(watermark: Buffer) {
    this.watermark = watermark;
  }

  public putWatermark = async (buffer: Buffer) => {
    const { width, height } = await sharp(buffer).metadata();
    if (!width || !height) throw new ValidationError('Cannot read file dimensions');

    let resizedWatermark: Buffer;
    const [decreasedHeight, decreasedWidth] = [~~(width * 0.41), ~~(height * 0.41)];

    if (width < height) {
      resizedWatermark = await this.resize(this.watermark, decreasedHeight);
    } else {
      resizedWatermark = await this.resize(this.watermark, decreasedWidth);
    }

    const watermarked = await sharp(buffer)
      .composite([{ input: resizedWatermark, gravity: 'centre' }])
      .toBuffer();

    return watermarked;
  };

  public resize = async (buffer: Buffer, newWidth: number, newHeight: number | null = null) => {
    return await sharp(buffer).resize(newWidth, newHeight).toBuffer();
  };

  public blur = async (buffer: Buffer) => {
    return await sharp(buffer).blur(3).toBuffer();
  };
}

export default EditImagesService;
