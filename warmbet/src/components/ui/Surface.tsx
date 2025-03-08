import { Box, BoxProps, useTheme } from '@mui/material';
import { FC, ReactNode } from 'react';

type UiSurfaceProps = BoxProps & {
    children: ReactNode;
};

export const UiSurface: FC<UiSurfaceProps> = (props) => {
    const theme = useTheme();

    return (
        <Box
            px={2}
            py={1}
            {...props}
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: `${theme.shape.borderRadius}px`,
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                overflow: 'hidden',
                ...props.sx,
            }}
        />
    );
};
