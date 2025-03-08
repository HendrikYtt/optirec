import { useEffect, useState } from 'react';

export type Page = {
    limit: number;
    offset: number;
};

export const usePaginate = <T>(
    func: (page: Page) => Promise<T[]>,
    { defaultLimit = 5 }: { defaultLimit?: number } = {},
) => {
    const initialPage: Page = { limit: defaultLimit, offset: 0 };

    const [result, setResult] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState<Page>(initialPage);

    const hasMore = !!result?.length && result.length % page.limit === 0;

    useEffect(() => {
        load(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const load = async (page: Page = initialPage) => {
        setIsLoading(true);
        try {
            const currentResult = await func(page);
            setResult([...result, ...currentResult]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = () => {
        setPage({ ...page, offset: page.offset + page.limit });
    };

    return [result, loadMore, { hasMore, load, isLoading }] as const;
};
