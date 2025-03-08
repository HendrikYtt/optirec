import Typography from '@mui/material/Typography';
import { Dialog, DialogActions, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UiButton } from '../components/ui/button/UiButton';

export const SessionExpired = () => {
    const navigate = useNavigate();

    return (
        <Dialog open={true} fullWidth>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '1rem',
                }}
            >
                <Typography variant="h5">Session expired</Typography>
                <Stack my={2}>
                    <DialogActions>
                        <UiButton
                            variant="contained"
                            title="Login"
                            onClick={() => {
                                navigate('/login');
                            }}
                        />
                    </DialogActions>
                </Stack>
            </Box>
        </Dialog>
    );
};
