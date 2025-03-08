import { Add } from '@mui/icons-material';
import {
    Card,
    CardActionArea,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { SyntheticEvent, useState } from 'react';
import { addApplication } from '../api/application';
import { useApplication } from '../contexts/Application';
import { HttpError } from '../lib/http';
import { useGetNewAccessToken } from '../lib/token';
import { parseValidationError } from '../lib/validation';

export const AddApplication: React.FC<{ onSuccessMessage: () => void }> = (props) => {
    const [open, setOpen] = useState(false);
    const [applicationName, setApplicationName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { loadApplications } = useApplication();
    const { getNewAccessToken } = useGetNewAccessToken();

    const setOpenHandler = () => {
        setOpen(true);
    };

    const successMessageHandler = () => {
        props.onSuccessMessage();
    };

    const closeDialog = () => {
        setOpen(false);
        setErrorMessage('');
        setApplicationName('');
    };

    const validateInput = () => {
        return Object.keys(applicationName).length !== 0;
    };

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            if (validateInput()) {
                await getNewAccessToken();
                await addApplication(applicationName);
                successMessageHandler();
                loadApplications();
                closeDialog();
                return;
            }
            setErrorMessage('Application name must be provided');
        } catch (error) {
            setErrorMessage(parseValidationError(error as HttpError));
        }
    };

    return (
        <Grid item xs={12} sm={6} md={4} key="0">
            <Card>
                <CardActionArea
                    onClick={setOpenHandler}
                    sx={{
                        minHeight: '175px',
                        display: 'grid',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CardContent>
                        <Stack alignItems="center">
                            <Add
                                sx={{
                                    fontSize: '40px',
                                }}
                            />
                            <Typography gutterBottom variant="body1" component="div" textTransform="none">
                                Add application
                            </Typography>
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>

            <Dialog open={open} onClose={() => closeDialog()}>
                <Box component="form" noValidate autoComplete="off" onSubmit={submit}>
                    <DialogTitle>Add application</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Application name"
                            onChange={(e) => setApplicationName(e.target.value)}
                            error={!!errorMessage}
                            helperText={errorMessage}
                            style={{ width: '350px' }}
                            margin="dense"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog}>Cancel</Button>
                        <Button type="submit" autoFocus variant="contained">
                            Add
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Grid>
    );
};
