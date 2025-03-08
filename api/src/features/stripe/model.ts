export type StripeCheckoutSession = {
    id: string;
    account_id: number;
    session_id: string;
    created_at: string;
};

export type StripeCustomer = {
    id: string;
    account_id: number;
    customer_id: string;
    created_at: string;
};
