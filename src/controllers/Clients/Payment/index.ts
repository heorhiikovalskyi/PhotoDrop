import Controller from '../../Controller';
import tryCatch from '../../../tryCatch';
import { Request, Response } from 'express';
import 'dotenv/config';
import ClientValidationService from '../../../services/Clients/Validation';
import AlbumsPaymentService from '../../../services/Clients/Payment';
import { ValidationError } from '../../../types/classes/Errors';
import express from 'express';

const { ALBUM_PRICE } = process.env;

class ClientPaymentController extends Controller {
  constructor(private clientValidation: ClientValidationService, private payment: AlbumsPaymentService) {
    super('/clients');
    this.router.get('/getPaymentLink', express.raw({ type: 'application/json' }), tryCatch(this.getPaymentLink));
    this.router.post('/paymentWebhook', express.raw({ type: 'application/json' }), tryCatch(this.webhook));
  }

  private getPaymentLink = async (req: Request, res: Response) => {
    const { authorization: token } = req.headers;

    const decoded = await this.clientValidation.json(token);

    const clientId = decoded.id;

    const { albumId, albumName } = req.query;

    if (typeof albumId !== 'string' || typeof albumName !== 'string') throw new ValidationError('album is not valid');

    const session = await this.payment.createSession(Number(ALBUM_PRICE) * 100, 'USD', albumName, {
      albumId,
      clientId,
    });

    return res.status(200).json({ url: session.url });
  };

  private webhook = async (req: Request, res: Response) => {
    let body = req.body;
    const signature = req.headers['stripe-signature'];

    if (typeof signature !== 'string') throw new ValidationError('signature is not valid');

    await this.payment.handleWebhook(body, signature);

    return res.status(200);
  };
}

export default ClientPaymentController;
