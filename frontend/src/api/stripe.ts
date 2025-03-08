import { http } from '../lib/http';

type PaymentMethodsRequest = {
    id: number;
    url: string;
};

type PaymentMethod = {
    id: string;
    card: {
        exp_month: number;
        exp_year: number;
        last4: string;
        brand: string;
    };
    created: number;
};

export const getPaymentMethods = async () => http.get<PaymentMethod[]>('/stripe/payment-methods');

export const addPaymentMethod = async () =>
    http.post<PaymentMethodsRequest>('/stripe/payment-methods', { url: window.location.href.split('?')[0] });
