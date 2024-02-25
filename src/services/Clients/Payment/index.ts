const { STRIPE_SECRET_KEY, FRONTEND_CLIENT_BASED_URL, WEBHOOK_SECRET } = process.env;
import stripe from 'stripe';
import { ValidationError } from '../../../types/classes/Errors';
import { AlbumsClientsRepository } from '../../../repositories/AlbumsClients';
import { DescripotionSchema } from './validation';

class AlbumsPaymentService {
  constructor(private stripe: stripe, private albumsClients: AlbumsClientsRepository) {}

  public createSession = async (
    toPay: number,
    currency: string,
    productDescription: string,
    description: { albumId: number; clientId: number }
  ) => {
    const session = await this.stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: { name: 'Payment', description: `Album: ${productDescription}` },
              unit_amount: toPay,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${FRONTEND_CLIENT_BASED_URL}/success/${description.albumId}`,
        cancel_url: FRONTEND_CLIENT_BASED_URL,

        payment_intent_data: { description: JSON.stringify(description) },
      },
      undefined
    );
    return session;
  };

  public handleWebhook = async (body: any, signature: string) => {
    const event = this.stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET!);
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentInfo_ = event.data.object.description;
        if (!paymentInfo_) throw new ValidationError('description is not valid');
        const paymentInfo = DescripotionSchema.parse(JSON.parse(paymentInfo_));
        const { clientId, albumId } = paymentInfo;
        await this.albumsClients.updatePaid(Number(clientId), Number(albumId));
        return;
      default:
        return;
    }
  };
}

export default AlbumsPaymentService;
