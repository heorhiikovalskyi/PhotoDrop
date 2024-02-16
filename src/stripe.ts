const { STRIPE_SECRET_KEY } = process.env;
import stripe from 'stripe';
export const stripeClient = new stripe(STRIPE_SECRET_KEY!);
