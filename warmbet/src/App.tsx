import { AppBar, Container, Stack, Toolbar, Typography, useTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import { LoginButton } from './components/LoginButton';
import { CoolbetPage } from './pages/CoolbetPage';
import ReactGA from 'react-ga4';

export const App = () => {
    const theme = useTheme();

    useEffect(() => {
        ReactGA.send('pageview');
    }, []);

    return (
        <SnackbarProvider>
            <AppBar
                elevation={0}
                position="sticky"
                sx={{
                    background: `linear-gradient(90deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 20%, ${theme.palette.background.paper} 80%, ${theme.palette.background.default} 100%)`,
                    boxShadow: `0px 2px 8px ${theme.palette.background.default}`,
                    border: 'none',
                }}
            >
                <Container>
                    <Toolbar>
                        <Typography component="div" fontSize={24} sx={{ flexGrow: 1 }}>
                            <Typography display="inline" fontSize="inherit" fontWeight={700} color="secondary">
                                Warm
                            </Typography>
                            <Typography display="inline" fontSize="inherit" fontWeight={300} sx={{ opacity: 0.75 }}>
                                bet
                            </Typography>
                        </Typography>
                        <Stack direction="row" alignItems="center" columnGap={2}>
                            <LoginButton />
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>
            <CoolbetPage />
        </SnackbarProvider>
    );
};
