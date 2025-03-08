import Stripe from 'stripe';
import { getStripeCustomer, insertCheckoutSession, insertStripeCustomer } from './repository';

export const stripe = new Stripe(
    'sk_test_51MafzPBmmU0p4Zl2VwhDpzd9FeVeneQ0j0Oc6UZUFECpsPDIxKXuDPMMkiRW3XI2jndC34BA0AwTvJkEsJKcS9jd00l3yYbE1B',
    {
        apiVersion: '2022-11-15',
        typescript: true,
    },
);

export const getPaymentMethods = async (accountId: number) => {
    const stripeCustomer = await getStripeCustomer(accountId);
    if (!stripeCustomer) {
        return [];
    }
    const paymentMethods = await stripe.customers.listPaymentMethods(stripeCustomer.customer_id);
    return paymentMethods.data;
};

export const createStripeCheckoutSession = async (accountId: number, url: string) => {
    let stripeCustomer = await getStripeCustomer(accountId);
    if (!stripeCustomer) {
        const customer = await stripe.customers.create({
            description: `Customer for optirec.ml, accountId: ${accountId.toString()}`,
        });
        stripeCustomer = await insertStripeCustomer({
            account_id: accountId,
            customer_id: customer.id,
        });
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'setup',
        customer: stripeCustomer.customer_id,
        success_url: `${url}?status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}?status=cancelled`,
    });

    await insertCheckoutSession({
        account_id: accountId,
        session_id: session.id,
    });
    return session;
};
