import { Paper } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Field, FieldProps, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { object, string } from 'yup';
import { login } from '../api/auth';
import { useAuth } from '../contexts/Auth';
import { HttpError } from '../lib/http';
import { parseValidationError } from '../lib/validation';

interface Values {
    email: string;
    password: string;
}

export const Login = () => {
    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = object({
        email: string().required('Required'),
        password: string().required('Required'),
    });

    const { authenticate, updateRefreshToken, setCookie } = useAuth();
    const [redirect, setRedirect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const serverErrorHandler = () => {
        setErrorMessage(errorMessage);
        setTimeout(() => {
            setErrorMessage('');
        }, 3000);
    };

    const submit = async (values: Values) => {
        try {
            const { access_token, refresh_token } = await login(values.email, values.password);
            authenticate(access_token);
            setCookie('refresh_token', refresh_token, { expires: 1 });
            updateRefreshToken(refresh_token);
            setRedirect(true);
        } catch (error) {
            console.log('===error: ', error);
            serverErrorHandler();
            setErrorMessage(parseValidationError(error as HttpError));
        }
    };

    if (redirect) {
        return <Navigate to="/dashboard" />;
    }
    return (
        <>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submit}>
                {(formik) => {
                    return (
                        <Form>
                            <Paper
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: {
                                        xs: '20rem',
                                        sm: '30rem',
                                    },
                                }}
                                elevation={1}
                            >
                                <Typography my={2} variant="h5">
                                    Login
                                </Typography>
                                <Field name="email">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            id="outlined-basic"
                                            label="Email address"
                                            helperText={meta.touched && meta.error}
                                            sx={{
                                                width: {
                                                    xs: '17rem',
                                                    sm: '20rem',
                                                },
                                                marginTop: '1rem',
                                                '.MuiFormHelperText-root': {
                                                    color: 'red',
                                                },
                                            }}
                                        />
                                    )}
                                </Field>
                                <Field name="password">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            id="outlined-password-input"
                                            label="Password"
                                            type="password"
                                            helperText={meta.touched && meta.error}
                                            sx={{
                                                width: {
                                                    xs: '17rem',
                                                    sm: '20rem',
                                                },
                                                margin: '1rem 0',
                                                '.MuiFormHelperText-root': {
                                                    color: 'red',
                                                },
                                            }}
                                        />
                                    )}
                                </Field>
                                <Typography color="red" variant="body2" mb={1}>
                                    {errorMessage}
                                </Typography>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disableElevation
                                    disabled={!formik.isValid && formik.touched.email && formik.touched.password}
                                    sx={{
                                        width: {
                                            xs: '17rem',
                                            sm: '20rem',
                                        },
                                        marginBottom: '1rem',
                                    }}
                                >
                                    Login
                                </Button>
                            </Paper>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};
