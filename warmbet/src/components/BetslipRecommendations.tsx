import { Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { useBetslip } from '../contexts/Betslip';
import { useQuery } from '../hooks/query';
import { recommendSimilarMatches } from '../services/optirec';
import { BetslipMatch } from './BetslipMatch';

type BetslipRecommendationsProps = {};

export const BetslipRecommendations: FC<BetslipRecommendationsProps> = () => {
    const { selections } = useBetslip();

    const matchId = selections?.at(-1)?.matchId;
    const [recommendations] = useQuery(async () => (matchId ? recommendSimilarMatches(matchId) : []), [matchId]);

    const betslipMatchIds = selections.map((x) => x.matchId);
    const recommendation = recommendations?.filter((x) => !betslipMatchIds.includes(x.id))[0];
    if (!recommendation) {
        return null;
    }

    return (
        <Stack rowGap={1}>
            <Typography>Recommended:</Typography>
            <BetslipMatch
                isRemovable={false}
                selection={{ matchId: recommendation.id, marketId: 'Match Result (1x2)', outcomeId: '0' }}
            />
        </Stack>
    );
};
