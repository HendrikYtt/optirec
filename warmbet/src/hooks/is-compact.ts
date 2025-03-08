import { useMediaQuery, useTheme } from '@mui/material';

export const useIsCompact = () => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.down('sm'));
};
