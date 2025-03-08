import { Box, useTheme } from '@mui/material';
import { lighten } from 'polished';
import { ReactNode } from 'react';
import { useBetslip } from '../contexts/Betslip';
import { SidebarTab, useSidebar } from '../contexts/Sidebar';

type OddsProps = { children: ReactNode; matchId: string; marketId: string; outcomeId: string };

export const Odds = ({ children, matchId, marketId, outcomeId }: OddsProps) => {
    const theme = useTheme();
    const { setTab } = useSidebar();
    const { addToBetslip, isInBetslip } = useBetslip();

    const selection = { matchId, marketId, outcomeId };

    return (
        <Box
            py={1}
            px={2}
            sx={{
                backgroundColor: lighten(0.05, theme.palette.background.paper),
                '&:hover': { backgroundColor: lighten(0.1, theme.palette.background.paper), cursor: 'pointer' },
                color: theme.palette.primary.main,
                letterSpacing: 1,
                ...(isInBetslip(selection) && {
                    backgroundColor: lighten(0.1, theme.palette.background.paper),
                }),
            }}
            onClick={() => {
                addToBetslip(selection);
                setTab(SidebarTab.BETSLIP);
            }}
        >
            {children}
        </Box>
    );
};
