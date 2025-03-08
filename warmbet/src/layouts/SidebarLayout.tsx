import { Box, Container, Dialog, Stack, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';
import { SidebarConsumer, SidebarProvider } from '../contexts/Sidebar';
import { useIsCompact } from '../hooks/is-compact';

type SideBarLayoutProps = {
    children: ReactNode;
    sidebar: ReactNode;
};

export const SidebarLayout: React.FC<SideBarLayoutProps> = ({ children, sidebar }) => {
    const theme = useTheme();
    const isCompact = useIsCompact();

    return (
        <SidebarProvider>
            <Container>
                <Stack direction="row" columnGap={2}>
                    <Box sx={{ py: 2, '& > *:not(:last-child)': { mb: 1 }, flexGrow: 1, overflow: 'hidden' }}>
                        {children}
                    </Box>
                    {!isCompact && (
                        <Box width="300px" sx={{ py: 2, '& > *:not(:last-child)': { mb: 1 } }}>
                            {sidebar}
                        </Box>
                    )}
                    {isCompact && (
                        <SidebarConsumer>
                            {({ isSidebarOpen, setIsSidebarOpen }) => (
                                <Dialog
                                    open={isSidebarOpen}
                                    onClose={() => setIsSidebarOpen(false)}
                                    fullWidth
                                    PaperProps={{
                                        elevation: 0,
                                        style: {
                                            backgroundColor: theme.palette.background.default,
                                            boxShadow: 'none',
                                        },
                                    }}
                                >
                                    <Box p={1}>{sidebar}</Box>
                                </Dialog>
                            )}
                        </SidebarConsumer>
                    )}
                </Stack>
            </Container>
        </SidebarProvider>
    );
};
