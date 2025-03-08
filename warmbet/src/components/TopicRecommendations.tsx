import { DoubleArrow } from '@mui/icons-material';
import { FC, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/Auth';
import { useSocketIO } from '../contexts/SocketIO';
import { useMatchById } from '../hooks/match-by-id';
import { useQuery } from '../hooks/query';
import { Match, recommendPopularMatches, recommendSimilarMatches, recommendTopics, Topic } from '../services/optirec';
import { RecommendationsList } from './RecommendationsList';

type TopicRecommendationsProps = {};

export const TopicRecommendations: FC<TopicRecommendationsProps> = () => {
    const { userId } = useAuth();
    const [topics, { load: loadTopics }] = useQuery(() => recommendTopics(userId as string), [userId]);
    const { subscribe } = useSocketIO();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => subscribe('models-reloaded', loadTopics), []);

    const matchIds = useMemo(
        () => topics?.filter(({ kind }) => kind === 'recent').map(({ value }) => value) ?? [],
        [topics],
    );
    const matchById = useMatchById(matchIds);

    return (
        <>
            {topics?.map((topic, index) => (
                <RecommendationsList
                    key={`${topic.kind}-${topic.value}-${index}`}
                    MatchListHeaderProps={{
                        title: formatTitle(topic, matchById),
                        description: 'Topic recommendations',
                        Icon: DoubleArrow,
                    }}
                    func={
                        topic.kind === 'recent'
                            ? () => recommendSimilarMatches(topic.value)
                            : (page) => recommendPopularMatches({ [`ìtem__${topic.kind}`]: topic.value }, page)
                    }
                    limit={3}
                />
            ))}
        </>
    );
};

const formatTitle = ({ kind, value }: Topic, matchById: Record<string, Match>) => {
    if (kind === 'team') {
        return (
            <>
                Events featuring <b>{value}</b>
            </>
        );
    }
    if (kind === 'sport') {
        return (
            <>
                Top picks for <b>{value}</b>
            </>
        );
    }
    if (kind === 'region') {
        return (
            <>
                Top picks in <b>{value}</b>
            </>
        );
    }
    if (kind === 'league') {
        return value;
    }
    const match = matchById[value];
    return (
        <>
            Because you placed a bet on{' '}
            <b>
                {match?.attributes.team[0]} - {match?.attributes.team[1]}
            </b>
        </>
    );
};
