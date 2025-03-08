import { knex } from '../../connections/knex';
import { StripeCheckoutSession, StripeCustomer } from './model';

export const insertCheckoutSession = async (checkoutSession: Omit<StripeCheckoutSession, 'id' | 'created_at'>) => {
    const [result] = await knex('stripe_checkout_sessions').insert(checkoutSession).returning('*');
    return result;
};

export const getStripeCustomer = async (accountId: number) => {
    return knex('stripe_customers').where('account_id', accountId).first();
};

export const insertStripeCustomer = async (stripeCustomer: Omit<StripeCustomer, 'id' | 'created_at'>) => {
    const [result] = await knex('stripe_customers').insert(stripeCustomer).returning('*');
    return result;
};
