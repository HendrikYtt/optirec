import { Receipt } from '@mui/icons-material';
import { Badge, Fab } from '@mui/material';
import { FC } from 'react';
import { useBetslip } from '../contexts/Betslip';
import { useSidebar } from '../contexts/Sidebar';
import { useIsCompact } from '../hooks/is-compact';

type BetslipButtonProps = {};

export const BetslipButton: FC<BetslipButtonProps> = () => {
    const { setIsSidebarOpen } = useSidebar();
    const { selections } = useBetslip();
    const isCompact = useIsCompact();

    if (!isCompact) {
        return null;
    }
    return (
        <Fab color="primary" sx={{ position: 'fixed', bottom: 16, right: 16 }}>
            <Badge badgeContent={selections?.length ? selections.length.toString() : undefined} color="info">
                <Receipt onClick={() => setIsSidebarOpen(true)} />
            </Badge>
        </Fab>
    );
};
