import { Stack, Typography, useTheme } from '@mui/material';
import { Odds } from './Odds';

const numOutcomesByName: Record<string, number> = {
    'Match Result (1x2)': 3,
    'Total Goals': 2,
    'Handicap (3 way)': 3,
};

type MarketTypeProps = { matchId: string; name: string };

export const MarketType = ({ matchId, name }: MarketTypeProps) => {
    const theme = useTheme();
    return (
        <Stack alignItems="center">
            <Typography variant="caption">{name}</Typography>
            <Stack
                direction="row"
                columnGap="1px"
                sx={{ borderRadius: `${theme.shape.borderRadius}px`, overflow: 'hidden' }}
            >
                {[2.85, 3.59, 2.49].slice(0, numOutcomesByName[name]).map((odds, index) => (
                    <Odds key={odds} matchId={matchId} marketId={name} outcomeId={index.toString()}>
                        {odds}
                    </Odds>
                ))}
            </Stack>
        </Stack>
    );
};
