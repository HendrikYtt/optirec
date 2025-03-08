import { DEFAULT_ICON_CONFIGS, IconProvider } from '@icon-park/react';
import '@icon-park/react/styles/index.css';
import { ThemeProvider } from '@mui/material';
import React from 'react';
import { createRoot } from 'react-dom/client';
import TagManager from 'react-gtm-module';
import { SnackbarProvider } from 'notistack';
import { App } from './App';
import { ApplicationProvider } from './contexts/Application';
import { AuthProvider } from './contexts/Auth';
import './index.css';
import { reportWebVitals } from './reportWebVitals';
import { theme } from './themes';

TagManager.initialize({ gtmId: 'GTM-N8D89FK' });

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <IconProvider value={{ ...DEFAULT_ICON_CONFIGS, prefix: 'icon' }}>
            <AuthProvider>
                <ApplicationProvider>
                    <ThemeProvider theme={theme}>
                        <SnackbarProvider maxSnack={3}>
                            <App />
                        </SnackbarProvider>
                    </ThemeProvider>
                </ApplicationProvider>
            </AuthProvider>
        </IconProvider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
