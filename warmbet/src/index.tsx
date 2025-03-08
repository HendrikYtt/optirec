import ReactDOM from 'react-dom/client';
import { App } from './App';
import reportWebVitals from './reportWebVitals';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { AuthProvider } from './contexts/Auth';
import { SocketIOProvider } from './contexts/SocketIO';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-VD80XNV90R');

const tone = '49';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: `hsla(${tone}, 100%, 50%, 1)`,
        },
        secondary: {
            main: `hsla(${tone}, 100%, 50%, 1)`,
        },
        text: {
            primary: '#f1f1f1',
            secondary: '#CDCDCC',
            disabled: '#797979',
        },
        background: {
            default: `hsla(${tone}, 10%, 5%, 1)`,
            paper: `hsla(${tone}, 10%, 10%, 1)`,
        },
        success: {
            main: '#7ee629',
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                },
            },
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
            styles={{
                body: {
                    backgroundImage: "url('/soccer-bg.png')",
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                },
                'body::-webkit-scrollbar': { width: 8 },
                'body::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius / 2,
                },
            }}
        />
        <SocketIOProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </SocketIOProvider>
    </ThemeProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
