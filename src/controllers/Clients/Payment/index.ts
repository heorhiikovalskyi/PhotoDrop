import Controller from '../../Controller';
import tryCatch from '../../../tryCatch';
import { Request, Response } from 'express';
import 'dotenv/config';
import ClientValidationService from '../../../services/Clients/Validation';
import AlbumsPaymentService from '../../../services/Clients/Payment';
import { ValidationError } from '../../../types/classes/Errors';
import express from 'express';
import { clientTokenHandler } from '../tokenHandler';
const { ALBUM_PRICE } = process.env;
import { AlbumSchema } from './validation';
import { z } from 'zod';

class ClientPaymentController extends Controller {
  constructor(private clientValidation: ClientValidationService, private payment: AlbumsPaymentService) {
    super('/clients');
    this.router.post('/paymentWebhook', express.raw({ type: 'application/json' }), tryCatch(this.webhook));
    this.router.get(
      '/getPaymentLink',
      express.raw({ type: 'application/json' }),
      tryCatch(clientTokenHandler),
      tryCatch(this.getPaymentLink)
    );
  }

  private getPaymentLink = async (req: Request, res: Response) => {
    const { clientId } = res.locals.user;

    const { albumId, albumName } = req.query;

    const album = AlbumSchema.parse({ albumId, albumName });

    const session = await this.payment.createSession(Number(ALBUM_PRICE) * 100, 'USD', album.albumName, {
      albumId: album.albumId,
      clientId,
    });

    return res.status(200).json({ url: session.url });
  };

  private webhook = async (req: Request, res: Response) => {
    let body = req.body;
    const signature_ = req.headers['stripe-signature'];

    const signature = z.string().parse(signature_);

    await this.payment.handleWebhook(body, signature);

    return res.status(200);
  };
}

export default ClientPaymentController;
