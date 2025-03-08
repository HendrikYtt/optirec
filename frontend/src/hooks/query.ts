import { useEffect, useState } from 'react';

type UseQueryProps = {
    loadOnMount?: boolean;
};

export const useQuery = <T>(func: () => Promise<T>, { loadOnMount = true }: UseQueryProps = {}) => {
    const [result, setResult] = useState<T>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (loadOnMount) {
            void load();
        }
    }, []);

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

    return [result, load, { isLoading }] as const;
};
