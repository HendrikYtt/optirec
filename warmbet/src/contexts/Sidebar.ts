import { useState } from 'react';
import { makeContext } from '../lib/context';

export enum SidebarTab {
    BETSLIP,
    BET_HISTORY,
}

export const [SidebarProvider, useSidebar, SidebarConsumer] = makeContext(() => {
    const [tab, setTab] = useState(SidebarTab.BETSLIP);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return { tab, setTab, isSidebarOpen, setIsSidebarOpen };
});
