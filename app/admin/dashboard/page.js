'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button, Tabs, Tab } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from 'notistack';
import useApiErrorHandler from '@/utils/useApiErrorHandler';

const AdminDashboard = () => {
const router = useRouter();
const pathname = usePathname();
const { enqueueSnackbar } = useSnackbar();
const { handleApiError } = useApiErrorHandler();

const [selectedTab, setSelectedTab] = useState(0);
const [loading, setLoading] = useState(true);
const [activityLogs, setActivityLogs] = useState([]);

const routes = ['/admin/dashboard', '/admin/manage-contracts', '/admin/activity-logs'];


useEffect(() => {
    const currentRoute = routes.indexOf(pathname);
    if (currentRoute !== -1) {
    setSelectedTab(currentRoute);
    }
}, [pathname]);

useEffect(() => {
    const fetchLogs = async () => {
    try {
        const response = await axiosInstance.get('/api/activity-tracking/activity-logs');
        setActivityLogs(response.data);
    } catch (error) {
        handleApiError(error);
    } finally {
        setLoading(false);
    }
    };
    
    fetchLogs();
}, []);

const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    router.push(routes[newValue]);
};

if (loading) {
    return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
    </Box>
    );
}

return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
            Admin Dashboard
        </Typography>
    </Container>
);
};

export default AdminDashboard;
