// app/lawfirms/dashboard.js
'use client';

import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

// Sample data for metrics
const metrics = {
    shares: 200,
    reads: 600,
    bookmarks: 150,
};

// Sample data for recent activities
const recentActivities = [
    { id: 1, description: 'Author Jane Doe created a new article "Understanding Contract Law"', date: '2024-09-02' },
    { id: 2, description: 'Law Firm added a new contract template "Employment Contract"', date: '2024-09-01' },
    { id: 3, description: 'Author John Smith edited an article "Introduction to Civil Rights"', date: '2024-08-30' },
];

const LawFirmDashboard = () => {
    const router = useRouter();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Title */}
            <Typography variant="h4" gutterBottom>
                Law Firm Dashboard
            </Typography>

            {/* Metrics Cards */}
            <Grid container spacing={4}>
                {Object.entries(metrics).map(([key, value]) => (
                    <Grid item xs={12} sm={4} key={key}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Typography>
                                <Typography variant="h3">{value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Quick Actions */}
            <Box sx={{ mt: 4, mb: 4 }}>
                <Button variant="contained" sx={{ mr: 2 }} onClick={() => router.push('/lawfirms/add-author')}>
                    Add Author
                </Button>
                <Button variant="outlined" onClick={() => router.push('/lawfirms/manage-authors')}>
                    Manage Authors
                </Button>
                <Button variant="outlined" sx={{ ml: 2 }} onClick={() => router.push('/lawfirms/create-contract')}>
                    Create Contract
                </Button>
                <Button variant="outlined" sx={{ ml: 2 }} onClick={() => router.push('/lawfirms/manage-contracts')}>
                    Manage Contracts
                </Button>
                <Button variant="outlined" sx={{ ml: 2 }} onClick={() => router.push('/lawfirms/articles')}>
                    View All Articles
                </Button>
            </Box>

            {/* Recent Activities */}
            <Typography variant="h5" gutterBottom>
                Recent Activities
            </Typography>
            <Box sx={{ mt: 2 }}>
                {recentActivities.map((activity) => (
                    <Card key={activity.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="body1">{activity.description}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Date: {activity.date}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
};

export default LawFirmDashboard;
