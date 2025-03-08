import { Alert, Stack } from '@mui/material';
import { FC } from 'react';
import { useAuth } from '../contexts/Auth';
import { useQuery } from '../hooks/query';
import { findInteractions } from '../services/optirec';
import { BetslipMatch } from './BetslipMatch';

type BetHistoryProps = {};

export const BetHistory: FC<BetHistoryProps> = () => {
    const { userId } = useAuth();
    const [interactions, { isLoading }] = useQuery(
        async () => (userId ? findInteractions(userId as string) : []),
        [userId],
    );

    if (!userId) {
        return <Alert severity="error">You must be logged in to see your bet history</Alert>;
    }

    if (!interactions?.length && !isLoading) {
        return <Alert severity="info">You do not have any bet history</Alert>;
    }

    return (
        <Stack rowGap={1}>
            {interactions?.map((interaction) => (
                <BetslipMatch
                    key={interaction.id}
                    selection={{
                        matchId: interaction.item_id,
                        marketId: interaction.attributes.market_type,
                        outcomeId: '0',
                    }}
                    isRemovable={false}
                />
            ))}
        </Stack>
    );
};
