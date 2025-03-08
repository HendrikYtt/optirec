import PromiseRouter from 'express-promise-router';
import { protect } from '../../lib/auth';
import { createStripeCheckoutSession, getPaymentMethods } from './service';

export const stripeRouter = PromiseRouter();

stripeRouter.get<unknown, unknown>('/payment-methods', protect(), async (req, res) => {
    console.log('1. ', req.account.sub);
    const paymentMethods = await getPaymentMethods(req.account.sub);
    res.json(paymentMethods);
});

stripeRouter.post<unknown, unknown>('/payment-methods', protect(), async (req, res) => {
    const session = await createStripeCheckoutSession(req.account.sub, req.body.url);
    res.json({ id: session.id, url: session.url });
});
