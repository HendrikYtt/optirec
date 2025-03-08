import Typography from '@mui/material/Typography';
import { object, string } from 'yup';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
    Box,
    Divider,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useEffect } from 'react';
import { FormikHelpers } from 'formik/dist/types';
import { useSnackbar } from 'notistack';
import { useSearchParams } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import { BaseLayout } from '../layout/BaseLayout';
import { useAuth } from '../contexts/Auth';
import { UiTitle } from '../components/ui/title/UiTitle';
import { changePassword } from '../api/auth';
import { parseValidationError } from '../lib/validation';
import { HttpError } from '../lib/http';
import { addPaymentMethod, getPaymentMethods } from '../api/stripe';
import { useQuery } from '../hooks/query';

interface Values {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export const Account = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { profile } = useAuth();
    const [searchParams] = useSearchParams();
    const [paymentMethods] = useQuery(getPaymentMethods);

    useEffect(() => {
        const status = searchParams.get('status');
        if (status === 'success') {
            enqueueSnackbar('Payment method added successfully', { variant: 'success' });
        } else if (status === 'cancelled') {
            enqueueSnackbar("Payment method couldn't be added", { variant: 'error' });
        }
    }, []);

    if (!profile) {
        return null;
    }
    const initialValues = {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    };

    const validationSchema = object({
        oldPassword: string().required('Required'),
        newPassword: string().required('Required'),
        confirmNewPassword: string().required('Required'),
    });

    const successMessageHandler = (message: string) => {
        enqueueSnackbar(message, { variant: 'success' });
    };

    const errorMessageHandler = (message: string) => {
        enqueueSnackbar(message, { variant: 'error' });
    };

    const submit = async (values: Values, formikHelpers: FormikHelpers<Values>) => {
        if (values.newPassword !== values.confirmNewPassword) {
            errorMessageHandler('New password and confirm new password do not match');
            return;
        }
        try {
            await changePassword(values.oldPassword, values.newPassword);
            successMessageHandler('Password changed successfully');
            formikHelpers.resetForm();
        } catch (error) {
            if (error instanceof HttpError) {
                errorMessageHandler(parseValidationError(error));
            } else {
                errorMessageHandler('Something went wrong');
            }
        }
    };

    const createPaymentMethod = async () => {
        const { url } = await addPaymentMethod();
        window.location.href = url;
    };

    return (
        <BaseLayout>
            <Box mt={4}>
                <UiTitle>Account</UiTitle>
            </Box>
            <Divider />
            <Stack alignItems={{ xs: 'center', sm: 'start' }} mt={3}>
                <Typography variant="h5">Email</Typography>
                <Typography variant="body1">{profile.email}</Typography>
            </Stack>
            <Divider />

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submit}>
                {(formik) => {
                    return (
                        <Form>
                            <Stack alignItems={{ xs: 'center', sm: 'start' }} rowGap={2}>
                                <Typography mt={2} variant="h6">
                                    Change password
                                </Typography>
                                <Field name="oldPassword">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            id="outlined-basic"
                                            label="Old password"
                                            type="password"
                                            helperText={meta.touched && meta.error}
                                            sx={{
                                                '.MuiFormHelperText-root': {
                                                    color: 'red',
                                                },
                                            }}
                                        />
                                    )}
                                </Field>
                                <Field name="newPassword">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            id="outlined-new-password-input"
                                            label="New password"
                                            type="password"
                                            helperText={meta.touched && meta.error}
                                            sx={{
                                                '.MuiFormHelperText-root': {
                                                    color: 'red',
                                                },
                                            }}
                                        />
                                    )}
                                </Field>
                                <Field name="confirmNewPassword">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            id="outlined-confirm-new-password-input"
                                            label="Confirm new password"
                                            type="password"
                                            helperText={meta.touched && meta.error}
                                            sx={{
                                                '.MuiFormHelperText-root': {
                                                    color: 'red',
                                                },
                                            }}
                                        />
                                    )}
                                </Field>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disableElevation
                                    disabled={
                                        (!formik.isValid &&
                                            formik.touched.oldPassword &&
                                            formik.touched.newPassword &&
                                            formik.touched.confirmNewPassword) ||
                                        formik.initialValues === formik.values
                                    }
                                >
                                    Change password
                                </Button>
                            </Stack>
                        </Form>
                    );
                }}
            </Formik>
            <Divider />
            <Stack alignItems={{ xs: 'center', sm: 'start' }} mt={3} rowGap={2}>
                <Typography variant="h5">Billing</Typography>
                <Button variant="contained" disableElevation onClick={createPaymentMethod}>
                    Add payment method
                </Button>
                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>Number</TableCell>
                                <TableCell>Expires</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paymentMethods?.map((row) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{row.card.brand}</TableCell>
                                    <TableCell>**** **** **** {row.card.last4}</TableCell>
                                    <TableCell>
                                        {row.card.exp_month}/{row.card.exp_year}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
            <Divider />
        </BaseLayout>
    );
};
