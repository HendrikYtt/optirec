import { useEffect, useState } from 'react';

export type UseQueryProps = {
    loadOnMount?: boolean;
};

export const useQuery = <T>(func: () => Promise<T>, deps: unknown[], { loadOnMount = true }: UseQueryProps = {}) => {
    const [result, setResult] = useState<T>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (loadOnMount) {
            void load();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    const load = async () => {
        setIsLoading(true);
        try {
            const result = await func();
            setResult(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return [result, { isLoading, setResult, load }] as const;
};
