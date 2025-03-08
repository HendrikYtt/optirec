import React, { useState } from 'react';
import {
    AppBar,
    Container,
    Grid,
    Toolbar,
    Typography,
    Dialog,
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Divider,
} from '@mui/material';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import MenuIcon from '@mui/icons-material/Menu';
import { theme } from '../themes';
import { useAuth } from '../contexts/Auth';
import { ContactUs } from '../pages/ContactUs';
import { useIsCompact } from '../hooks/is-compact';
import { UiButton } from './ui/button/UiButton';

export const AppHeader = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isContactUsOpen, setIsContactUsOpen] = useState(false);
    const navigate = useNavigate();
    const isCompact = useIsCompact();
    const { pathname } = useLocation();
    const { isLoggedIn, logout } = useAuth();

    const openDrawer = () => {
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    const openDialog = () => {
        setIsContactUsOpen(true);
    };

    const closeDialog = () => {
        setIsContactUsOpen(false);
    };

    const routes = [
        ...(isLoggedIn
            ? [
                  { path: '/account', name: 'Account' },
                  { path: '/dashboard', name: 'Dashboard' },
                  {
                      action: () => {
                          logout();
                          navigate('/', { replace: true });
                      },
                      name: 'Log out',
                  },
              ]
            : [{ path: '/login', name: 'Login' }]),
    ];

    const navigateTo = (path: string) => {
        if (path === window.location.pathname) {
            return;
        }
        navigate(path);
    };

    return (
        <>
            <AppBar position="fixed" elevation={0}>
                <Toolbar disableGutters>
                    <Container>
                        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography
                                    variant="h5"
                                    component="a"
                                    onClick={() => navigateTo('/')}
                                    sx={{ userSelect: 'none' }}
                                >
                                    <Box fontWeight="bold" display="inline">
                                        Opti
                                    </Box>
                                    <Box display="inline" sx={{ opacity: 0.5 }}>
                                        Rec
                                    </Box>
                                </Typography>
                            </Grid>
                            <Grid item>
                                {!isCompact && (
                                    <Stack direction="row" spacing={2}>
                                        <UiButton
                                            variant="text"
                                            title="Contact Us"
                                            onClick={openDialog}
                                            size="large"
                                            style={{ color: theme.palette.text.primary }}
                                        />
                                        {routes.map(({ path = '', action = () => navigateTo(path), name }) => (
                                            <UiButton
                                                key={path}
                                                variant="text"
                                                title={name}
                                                onClick={action}
                                                size="large"
                                                style={{
                                                    fontWeight: matchPath(pathname, path) ? 'bold' : 'normal',
                                                    color: theme.palette.text.primary,
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                )}
                                {isCompact && (
                                    <>
                                        <IconButton
                                            onClick={openDrawer}
                                            size="large"
                                            edge="start"
                                            color="inherit"
                                            aria-label="logo"
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                        <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
                                            <Box width="180px" role="presentation">
                                                <List>
                                                    <ListItem
                                                        key="contact-us"
                                                        sx={{
                                                            height: '50px',
                                                            padding: 0,
                                                        }}
                                                    >
                                                        <ListItemButton
                                                            onClick={() => {
                                                                openDialog();
                                                            }}
                                                        >
                                                            <ListItemText primary="Contact Us" />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <Divider />
                                                    {routes.map(
                                                        ({ path = '', action = () => navigateTo(path), name }) => (
                                                            <React.Fragment key={path}>
                                                                <ListItem
                                                                    disablePadding
                                                                    sx={{
                                                                        height: '50px',
                                                                    }}
                                                                >
                                                                    <ListItemButton
                                                                        onClick={() => {
                                                                            action();
                                                                            closeDrawer();
                                                                        }}
                                                                    >
                                                                        <ListItemText primary={name} />
                                                                    </ListItemButton>
                                                                </ListItem>
                                                                <Divider />
                                                            </React.Fragment>
                                                        ),
                                                    )}
                                                </List>
                                            </Box>
                                        </Drawer>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                        <Dialog
                            open={isContactUsOpen}
                            onClose={() => closeDialog()}
                            aria-labelledby="dialog-title"
                            aria-describedby="dialog-description"
                            maxWidth="md"
                        >
                            <ContactUs />
                        </Dialog>
                    </Container>
                </Toolbar>
            </AppBar>
        </>
    );
};
