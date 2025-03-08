import { Close } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { Selection, useBetslip } from '../contexts/Betslip';
import { useQuery } from '../hooks/query';
import { getMatchById } from '../services/optirec';
import { MarketType } from './MarketType';
import { UiSurface } from './ui/Surface';

type BetslipMatchProps = { selection: Selection; isRemovable?: boolean };

export const BetslipMatch: FC<BetslipMatchProps> = ({ selection, isRemovable = true }) => {
    const { matchId, marketId } = selection;

    const { removeFromBetslip } = useBetslip();
    const [match] = useQuery(() => getMatchById(matchId), [matchId]);

    if (!match) {
        return null;
    }
    return (
        <UiSurface key={matchId}>
            <Stack rowGap={1}>
                <Typography variant="caption" color="text.disabled">
                    {match.attributes.sport} / {match.attributes.region} / {match.attributes.league}
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack>
                        <Typography>
                            {match.attributes.team[0]}
                            <br />
                            {match.attributes.team[1]}
                        </Typography>
                    </Stack>
                    {isRemovable && (
                        <IconButton size="small" onClick={() => removeFromBetslip({ matchId })}>
                            <Close />
                        </IconButton>
                    )}
                </Stack>
                <MarketType matchId={match.id} name={marketId} />
            </Stack>
        </UiSurface>
    );
};
