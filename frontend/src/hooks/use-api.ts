import { useState } from 'react';
import { http } from '../lib/http';
import { useQuery } from './query';

export const useGet = <T>(path: string) => {
    return useQuery(() => http.get<T>(path));
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const usePost = <T, R = unknown>(path: string, { after = () => {} }: { after?: () => unknown }) => {
    const [result, setResult] = useState<R>();
    const [isLoading, setIsLoading] = useState(false);

    const post = async (body: T) => {
        setIsLoading(true);
        try {
            const result = await http.post<R>(path, body);
            setResult(result);
            after();
            return result;
        } finally {
            setIsLoading(false);
        }
    };

    return [post, { result, isLoading }] as const;
};

export const useDelete = <T>(
    path: (id: T) => string,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    { after = () => {} }: { after?: () => unknown },
) => {
    const [isLoading, setIsLoading] = useState(false);

    const handle = async (id: T) => {
        setIsLoading(true);
        try {
            await http.delete(path(id), {});
            after();
        } finally {
            setIsLoading(false);
        }
    };

    return [handle, { isLoading }] as const;
};
