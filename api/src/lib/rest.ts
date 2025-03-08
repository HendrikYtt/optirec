import fetch from 'node-fetch';
import { BaseError } from './errors';
import { log } from './log';

type HttpOptions = {
    method: string;
    headers: Record<string, string>;
    baseUrl?: string;
};

const makeHttp = (options: HttpOptions) => {
    const makeMethod = async <T>(
        method: string,
        path: string,
        { body, query }: { body?: unknown; query?: Record<string, string> },
    ) => {
        const { baseUrl, headers } = options;

        const search = query ? `?${new URLSearchParams(query).toString()}` : '';

        const response = await fetch(`${baseUrl}${path}${search}`, {
            method,
            headers,
            ...(!!body && { body: JSON.stringify(body) }),
        });

        let responseBody = await response.text();
        try {
            responseBody = JSON.parse(responseBody);
            // eslint-disable-next-line no-empty
        } catch {}

        if (response.status >= 400) {
            log.error(
                `HTTP ${method} ${path} failed with status ${response.status} and body ${JSON.stringify(responseBody)}`,
            );
            throw new BaseError(response.status, 'Request failed', responseBody);
        }
        return responseBody as T;
    };

    return {
        get: <T>(path: string, query?: Record<string, string>) => makeMethod<T>('GET', path, { query }),
        post: <T>(path: string, body: unknown) => makeMethod<T>('POST', path, { body }),
        setBaseUrl: (baseUrl: string) => makeHttp({ ...options, baseUrl }),
        setHeader: (key: string, value: string) =>
            makeHttp({ ...options, headers: { ...options.headers, [key]: value } }),
    };
};

export const http = makeHttp({
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    baseUrl: '',
});
