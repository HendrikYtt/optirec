import { FC, useEffect } from 'react';
import { useSocketIO } from '../contexts/SocketIO';
import { Page, usePaginate } from '../hooks/paginate';
import { Recommendation } from '../services/optirec';
import { MatchList } from './MatchList';
import { MatchListHeader, MatchListHeaderProps } from './MatchListHeader';

type RecommendationsListProps = {
    MatchListHeaderProps: MatchListHeaderProps;
    func: (page: Page) => Promise<Recommendation[]>;
    limit?: number;
};

export const RecommendationsList: FC<RecommendationsListProps> = ({ MatchListHeaderProps, func, limit }) => {
    const [recommendations, loadMore, { hasMore, load, isLoading }] = usePaginate(func, { defaultLimit: limit });
    const { subscribe } = useSocketIO();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => subscribe('models-reloaded', load), []);

    if (!recommendations?.length) {
        return null;
    }
    return (
        <>
            <MatchListHeader {...MatchListHeaderProps} />
            <MatchList recommendations={recommendations} hasMore={hasMore} loadMore={loadMore} isLoading={isLoading} />
        </>
    );
};
