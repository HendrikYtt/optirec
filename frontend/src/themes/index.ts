import { createTheme, darken, lighten, ThemeOptions } from '@mui/material/styles';

const colors = {
    background: '#060024',
    paper: '#100C30',
    palette: {
        primary: '#7ee629',
        secondary: '#f1b002',
    },
    font: {
        primary: '#ffffff',
        secondary: '#CDCDCC',
        contrast: '#24440a',
    },
};

const mode = 'dark' as const;

const shadow = {
    dark: 'none',
    light: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
}[mode];

export const theme = createTheme({
    palette: {
        mode,
        primary: {
            main: colors.palette.primary,
            dark: darken(colors.palette.primary, 0.1),
            light: lighten(colors.palette.primary, 0.1),
            contrastText: colors.font.contrast,
        },
        secondary: {
            main: colors.palette.secondary,
            dark: darken(colors.palette.secondary, 0.1),
            light: lighten(colors.palette.secondary, 0.1),
            contrastText: colors.font.contrast,
        },
        background: {
            default: colors.background,
            paper: colors.paper,
        },
        text: {
            primary: colors.font.primary,
            secondary: colors.font.secondary,
        },
    },
    typography: {
        fontFamily: 'Montserrat, sans-serif',
        button: {
            textTransform: 'none',
        },
    },
    shadows: ['none', ...Array(24).fill(shadow)] as ThemeOptions['shadows'],
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.background,
                    color: colors.font.primary,
                    height: '64px',
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgb(36, 36, 35, 0.1)',
                },
            },
        },
    },
});
