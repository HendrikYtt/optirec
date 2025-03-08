import { Stack, Tab, Tabs } from '@mui/material';
import { FC } from 'react';
import { SidebarTab, useSidebar } from '../contexts/Sidebar';
import { BetHistory } from './BetHistory';
import { Betslip } from './Betslip';
import { UiSurface } from './ui/Surface';

type SidebarProps = {};

export const Sidebar: FC<SidebarProps> = () => {
    const { tab, setTab } = useSidebar();
    return (
        <Stack rowGap={1} sx={{ position: 'sticky', top: 66 + 16 }}>
            <UiSurface p={0}>
                <Tabs value={tab} onChange={(_, value) => setTab(value)}>
                    <Tab label="Betslip" sx={{ flexGrow: 1 }} />
                    <Tab label="Bet History" sx={{ flexGrow: 1 }} />
                </Tabs>
            </UiSurface>

            {tab === SidebarTab.BETSLIP && <Betslip />}
            {tab === SidebarTab.BET_HISTORY && <BetHistory />}
        </Stack>
    );
};
