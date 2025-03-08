import { Container } from '@mui/system';
import React from 'react';

export const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Container component="div" sx={{ py: 8, '& > *:not(:last-child)': { mb: 1 }, minHeight: `100vh` }}>
            {children}
        </Container>
    );
};
