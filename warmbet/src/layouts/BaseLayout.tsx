import { Container } from '@mui/system';
import React from 'react';

export const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Container sx={{ py: 2, '& > *:not(:last-child)': { mb: 1 } }}>{children}</Container>;
};
