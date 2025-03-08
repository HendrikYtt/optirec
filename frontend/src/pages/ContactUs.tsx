import { DialogActions, DialogContent, DialogTitle, Paper, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Field, FieldProps, Form, Formik } from 'formik';
import { object, string } from 'yup';

export const ContactUs = () => {
    const initialValues = {
        email: '',
        name: '',
        message: '',
    };

    const validationSchema = object({
        email: string().required('Required'),
        name: string().required('Required'),
        message: string().required('Required'),
    });

    const submit = async () => {
        console.log('message sent');
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submit}>
            {(formik) => (
                <Form>
                    <Paper elevation={1}>
                        <DialogTitle>
                            Drop us a line, let’s discuss your own development plans. If you’ve got a question about
                            implementation or any question regarding our service, our professional team can be the first
                            line of help.
                        </DialogTitle>
                        <DialogContent>
                            <Stack spacing={1} style={{ width: '100%' }}>
                                <Field name="email">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            id="outlined-basic"
                                            label="Email"
                                            helperText={meta.touched && meta.error}
                                            error={!!(meta.touched && meta.error)}
                                            margin="dense"
                                        />
                                    )}
                                </Field>
                                <Field name="name">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            id="outlined-name-input"
                                            label="Name"
                                            type="name"
                                            helperText={meta.touched && meta.error}
                                            error={!!(meta.touched && meta.error)}
                                            margin="dense"
                                        />
                                    )}
                                </Field>
                                <Field name="message">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            id="outlined-message-input"
                                            label="Message"
                                            type="message"
                                            multiline
                                            minRows={3}
                                            helperText={meta.touched && meta.error}
                                            error={!!(meta.touched && meta.error)}
                                            margin="dense"
                                        />
                                    )}
                                </Field>
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={
                                    !formik.isValid &&
                                    formik.touched.email &&
                                    formik.touched.name &&
                                    formik.touched.message
                                }
                            >
                                Send
                            </Button>
                        </DialogActions>
                    </Paper>
                </Form>
            )}
        </Formik>
    );
};
