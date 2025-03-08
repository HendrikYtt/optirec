import { Button, Stack } from '@mui/material';
import { map } from 'bluebird';
import { useSnackbar } from 'notistack';
import { FC } from 'react';
import { useAuth } from '../contexts/Auth';
import { useBetslip } from '../contexts/Betslip';
import { sendInteractions } from '../services/optirec';
import { BetslipMatch } from './BetslipMatch';
import { BetslipRecommendations } from './BetslipRecommendations';
import { UiSurface } from './ui/Surface';

type BetslipProps = {};

export const Betslip: FC<BetslipProps> = () => {
    const { userId } = useAuth();
    const { selections, clearBetslip } = useBetslip();
    const { enqueueSnackbar } = useSnackbar();

    const placeBet = async () => {
        await map(selections, ({ matchId, marketId }) =>
            sendInteractions({ user_id: userId!, item_id: matchId, attributes: { market_type: marketId } }),
        );
        enqueueSnackbar('Bet was placed successfully!', { variant: 'success' });
        clearBetslip();
    };

    return (
        <Stack rowGap={1}>
            {selections.map((selection, index) => (
                <BetslipMatch
                    key={`${selection.matchId}-${selection.marketId}-${selection.outcomeId}-${index}`}
                    selection={selection}
                />
            ))}
            <UiSurface p={1}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={placeBet}
                    disabled={!selections?.length || !userId}
                    fullWidth
                >
                    Place bet
                </Button>
            </UiSurface>
            <BetslipRecommendations />
        </Stack>
    );
};
