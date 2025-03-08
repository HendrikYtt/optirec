import { Add, ContentCopy, Delete, ExpandMore } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import { createApplicationKey, deleteApplicationKey, getApiKeysByApplicationId } from '../api/application';
import { GetApiKeyResponseSchema } from '../schemas/application';
import { useGetNewAccessToken } from '../lib/token';
import { HttpError } from '../lib/http';
import { useAuth } from '../contexts/Auth';
import { UiButton } from './ui/button/UiButton';
import { UiTitle } from './ui/title/UiTitle';

export const ApiKey: React.FC<{
    id: string;
}> = (props) => {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [confirmAddDialogOpen, setConfirmAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [apiKeyIdToBeDeleted, setApiKeyIdToBeDeleted] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();
    const { logout } = useAuth();
    const [currentApiKey, setCurrentApiKey] = useState('');
    const [apiKeys, setApiKeys] = useState<GetApiKeyResponseSchema[]>();
    const [isLoading, setIsLoading] = useState(false);
    const { getNewAccessToken } = useGetNewAccessToken();

    useEffect(() => {
        void loadApiKeys();
    }, []);

    const setConfirmAddDialogOpenHandler = () => {
        setConfirmAddDialogOpen(true);
    };

    const closeConfirmAddDialog = () => {
        setConfirmAddDialogOpen(false);
    };

    const setAddDialogOpenHandler = () => {
        setAddDialogOpen(true);
    };

    const closeAddDialog = () => {
        setAddDialogOpen(false);
        setCurrentApiKey('');
    };

    const setDeleteDialogOpenHandler = (id: string) => {
        setApiKeyIdToBeDeleted(id);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    const [expanded, setExpanded] = useState<string | false>(false);
    const handleChange = (isExpanded: boolean, panel: string) => {
        setExpanded(isExpanded ? panel : false);
    };

    const successMessageHandler = (message: string) => {
        enqueueSnackbar(message, { variant: 'success' });
    };

    const errorMessageHandler = (message: string) => {
        enqueueSnackbar(message, { variant: 'error' });
    };

    const loadApiKeys = async () => {
        setIsLoading(true);
        const token = await getNewAccessToken();
        if (!token) {
            navigate('/expired');
            return;
        }
        let apiKeys: GetApiKeyResponseSchema[] = [];
        try {
            apiKeys = await getApiKeysByApplicationId(props.id.toString());
        } catch (error) {
            if (error instanceof HttpError && error.body.message === 'jwt expired') {
                logout();
                navigate('/expired');
                return;
            }
        }
        setApiKeys(apiKeys);
        setIsLoading(false);
    };
    const createApiKey = async () => {
        const currentApiKey = await createApplicationKey(props.id);
        setCurrentApiKey(currentApiKey.key);
    };

    const removeApiKey = async (id: string) => {
        await deleteApplicationKey(id);
    };

    const addApiKey = async () => {
        try {
            await getNewAccessToken();
            await createApiKey();
            successMessageHandler('API key added successfully');
            await loadApiKeys();
            setAddDialogOpenHandler();
        } catch (error) {
            console.log(error);
            if (error instanceof HttpError && error.body.message === 'jwt expired') {
                navigate('/expired');
                logout();
                return;
            } else {
                errorMessageHandler('Could not add API key');
            }
        }
    };

    const deleteApiKey = async (id: string) => {
        try {
            await getNewAccessToken();
            await removeApiKey(id);
            successMessageHandler('API key deleted successfully');
            closeDeleteDialog();
            await loadApiKeys();
        } catch (error) {
            console.log(error);
            if (error instanceof HttpError && error.body.message === 'jwt expired') {
                navigate('/expired');
                logout();
                return;
            } else {
                errorMessageHandler('Could not delete API key');
            }
        }
    };

    const apiKeysExist = () => !!apiKeys?.length;

    const formatDate = (dateStr: string): string => {
        if (!dateStr) {
            return 'Never';
        }
        const date = new Date(dateStr);
        const options = {
            day: 'numeric' as const,
            month: 'short' as const,
            year: 'numeric' as const,
        };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <Box mt={4}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack>
                    <UiTitle>API keys</UiTitle>
                    <Typography my={1}>
                        Generate API key for your application in order to integrate your site to our platform.
                    </Typography>
                    <Typography my={1}>
                        Please note that we do not display your secret API keys again after you generate them. Do not
                        share your API key with others, or expose it in the browser or other client-side code.
                    </Typography>
                </Stack>
                <UiButton variant="contained" title="Add" endIcon={<Add />} onClick={setConfirmAddDialogOpenHandler} />
            </Stack>
            {apiKeysExist() ? (
                <Paper sx={{ p: 1 }}>
                    <Accordion
                        expanded={expanded === 'panel1'}
                        onChange={(event, isExpanded) => handleChange(isExpanded, 'panel1')}
                    >
                        <AccordionSummary aria-controls="panel1-content" id="panel1-header" expandIcon={<ExpandMore />}>
                            <Typography>{expanded ? 'Click to hide API keys' : 'Click to show API keys'}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer component={Paper}>
                                <Table stickyHeader aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Key</TableCell>
                                            <TableCell>Created</TableCell>
                                            <TableCell>Last used</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {apiKeys?.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell>{row.key}</TableCell>
                                                <TableCell>{formatDate(row.created_at)}</TableCell>
                                                <TableCell>{formatDate(row.last_used_at)}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => {
                                                            setDeleteDialogOpenHandler(row.id.toString());
                                                            setCurrentApiKey(row.key);
                                                        }}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                </Paper>
            ) : !isLoading ? (
                <Alert severity="info">No API keys yet</Alert>
            ) : (
                <CircularProgress />
            )}

            <Dialog fullWidth={true} open={confirmAddDialogOpen} onClose={closeConfirmAddDialog}>
                <DialogTitle>Add API key</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" mb={2}>
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmAddDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            closeConfirmAddDialog();
                            addApiKey();
                            setAddDialogOpenHandler();
                        }}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog fullWidth={true} open={addDialogOpen} onClose={closeAddDialog}>
                <DialogTitle>API key generated</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" mb={2}>
                        Please save this secret key somewhere safe and accessible. For security reasons, you won't be
                        able to view it again through your OptiRec account. If you lose this secret key, you'll need to
                        generate a new one.
                    </Typography>
                    <Stack direction="row">
                        <TextField
                            sx={{ width: '100%' }}
                            type="text"
                            inputProps={{ readOnly: true }}
                            value={currentApiKey}
                        />
                        <IconButton
                            onClick={() => {
                                navigator.clipboard.writeText(currentApiKey);
                                successMessageHandler('API key copied');
                            }}
                        >
                            <ContentCopy />
                        </IconButton>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={closeAddDialog}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog fullWidth={true} open={deleteDialogOpen} onClose={closeDeleteDialog}>
                <DialogTitle>Delete API key</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" mb={2}>
                        This API key will immediately be disabled. API requests made using this key will be rejected,
                        which could cause any systems still depending on it to break.
                    </Typography>
                    <Stack direction="row">
                        <TextField
                            sx={{ width: 'max-content' }}
                            type="text"
                            inputProps={{ readOnly: true }}
                            value={currentApiKey}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                            deleteApiKey(apiKeyIdToBeDeleted);
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
