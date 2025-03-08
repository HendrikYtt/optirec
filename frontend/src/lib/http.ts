import { storage } from './storage';

type HttpOptions = {
    baseUrl: string;
};

export const createHttp = ({ baseUrl }: HttpOptions) => {
    const getToken = () => storage.get('token');

    const makeRequest = async <T>(path: string, method: string, body?: unknown) => {
        const token = getToken();
        const response = await fetch(`${baseUrl}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            ...(!!body && { body: JSON.stringify(body) }),
        });

        let responseBody: unknown;
        try {
            responseBody = await response.json();
            // eslint-disable-next-line no-empty
        } catch {}

        if (!response.ok) {
            throw new HttpError(response.status, responseBody as HttpError['body']);
        }
        return responseBody as Promise<T>;
    };

    return {
        get: <T>(path: string) => makeRequest<T>(path, 'GET'),
        post: <T>(path: string, body: unknown) => makeRequest<T>(path, 'POST', body),
        delete: <T>(path: string, body: unknown) => makeRequest<T>(path, 'DELETE', body),
        put: <T>(path: string, body: unknown) => makeRequest<T>(path, 'PUT', body),
    };
};

export class HttpError<T = unknown> {
    constructor(public status: number, public body: { message: string; details: T }) {}
}

const { REACT_APP_API_URL = window.location.origin.replace('www.', 'api.') } = process.env;

export const http = createHttp({ baseUrl: REACT_APP_API_URL });
