import React, { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Card, Tab } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ApexOptions } from 'apexcharts';
// eslint-disable-next-line import/default
import ReactApexChart from 'react-apexcharts';

type PointValues = {
    monthly: number[];
    weekly: number[];
};

type Series = {
    name: string;
    data: PointValues;
};

type ChartProps = {
    colors: string[];
    footerText: string;
    seriesData: Series[];
    graphType: 'area' | 'bar' | 'line';
    showLabels: boolean;
};

export const Chart: React.FC<ChartProps> = ({ colors, footerText, seriesData, graphType, showLabels }) => {
    const [value, setValue] = useState('month');
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    const secondary = '#8c8c8c';

    const options: ApexOptions = {
        chart: {
            toolbar: {
                show: false,
            },
        },
        legend: {
            show: true,
            labels: {
                colors: secondary,
            },
        },
        dataLabels: {
            enabled: showLabels,
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        colors: colors,
        xaxis: {
            categories:
                value === 'month'
                    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            labels: {
                style: {
                    colors: secondary,
                },
            },
            tickAmount: value === 'month' ? 11 : 7,
        },
        yaxis: {
            labels: {
                style: {
                    colors: secondary,
                },
            },
        },
        tooltip: {
            theme: 'dark',
        },
    };

    const seriesValues: { name: string; data: number[] }[] = [];

    seriesData.map((series) => {
        seriesValues.push({
            name: series.name,
            data: value === 'month' ? series.data.monthly : series.data.weekly,
        });
    });

    return (
        <Card>
            <TabContext value={value}>
                <TabList onChange={handleChange} textColor="primary" indicatorColor="primary" scrollButtons="auto">
                    <Tab label="Weekly" value="week" />
                    <Tab label="Monthly" value="month" />
                </TabList>
                <TabPanel value="1"></TabPanel>
                <TabPanel value="2"></TabPanel>
            </TabContext>
            <ReactApexChart options={options} series={seriesValues} type={graphType} height={300} />
            <Typography variant="body1" color="grey" textAlign="center" pb={1}>
                {footerText}
            </Typography>
        </Card>
    );
};
