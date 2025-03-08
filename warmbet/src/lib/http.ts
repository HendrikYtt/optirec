type HttpOptions = {
    baseUrl: string;
    headers?: Record<string, string>;
};

export const createHttp = ({ baseUrl, headers = {} }: HttpOptions) => {
    const makeRequest = async <T>(
        path: string,
        method: string,
        { body, query }: { body?: unknown; query?: Record<string, any> },
    ) => {
        const search = query ? `?${new URLSearchParams(query).toString()}` : '';

        const response = await fetch(`${baseUrl}${path}${search}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            ...(!!body && { body: JSON.stringify(body) }),
        });
        const responseBody = await response.json();
        if (!response.ok) {
            throw new HttpError(response.status, responseBody);
        }
        return responseBody as Promise<T>;
    };

    return {
        get: <T>(path: string, query?: Record<string, any>) => makeRequest<T>(path, 'GET', { query }),
        post: <T>(path: string, body: unknown) => makeRequest<T>(path, 'POST', { body }),
        delete: <T>(path: string, body: unknown) => makeRequest<T>(path, 'DELETE', { body }),
        put: <T>(path: string, body: unknown) => makeRequest<T>(path, 'PUT', { body }),
    };
};

export class HttpError<T = unknown> {
    constructor(public status: number, public body: { message: string; details: T }) {}
}
