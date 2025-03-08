import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { SxProps, Tab, Theme } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { BaseLayout } from '../layout/BaseLayout';
import { Register } from '../components/Register';
import { Login } from '../components/Login';

const tabButtonStyle: SxProps<Theme> = {
    fontWeight: '300',
    flex: 1,
    fontSize: {
        xs: '.75rem',
        sm: '1rem',
    },
};

export const SignUp = () => {
    const [value, setValue] = useState('1');
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    return (
        <BaseLayout>
            <Box
                sx={{
                    marginX: 'auto',
                    marginTop: '5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <TabContext value={value}>
                    <TabList onChange={handleChange} textColor="primary" indicatorColor="primary" scrollButtons="auto">
                        <Tab label="Login" value="1" sx={tabButtonStyle} />
                        <Tab label="Register" value="2" sx={tabButtonStyle} />
                    </TabList>
                    <TabPanel value="1">
                        <Login />
                    </TabPanel>
                    <TabPanel value="2">
                        <Register />
                    </TabPanel>
                </TabContext>
            </Box>
        </BaseLayout>
    );
};
