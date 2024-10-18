'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button, CardActionArea } from '@mui/material';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import CircularProgress from '@mui/material/CircularProgress';

const LawFirmDashboard = () => {
    const router = useRouter();
    const [metrics, setMetrics] = useState({
        total_articles: 0,
        total_reads: 0,
        total_bookmarks: 0,
        total_shares: 0,
        total_authors: 0,
        recent_articles: [],
        recent_activities: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await axiosInstance.get('/api/lawfirms/summary/');
                setMetrics(response.data);
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Title */}
            <Typography variant="h4" gutterBottom>
                Law Firm Dashboard
            </Typography>

            {/* Metrics Cards */}
            <Grid container spacing={4}>
                <Grid item xs={12} sm={3}>
                    <CardActionArea onClick={() => router.push('/lawfirms/manage-authors')}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Authors
                                </Typography>
                                <Typography variant="h3">{metrics.total_authors}</Typography>
                            </CardContent>
                        </Card>
                    </CardActionArea>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <CardActionArea onClick={() => router.push('/lawfirms/articles')}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Articles
                                </Typography>
                                <Typography variant="h3">{metrics.total_articles}</Typography>
                            </CardContent>
                        </Card>
                    </CardActionArea>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Reads
                            </Typography>
                            <Typography variant="h3">{metrics.total_reads}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Bookmarks
                            </Typography>
                            <Typography variant="h3">{metrics.total_bookmarks}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Shares
                            </Typography>
                            <Typography variant="h3">{metrics.total_shares}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Box sx={{ mt: 4, mb: 4 }}>
                <Button variant="contained" sx={{ mr: 2 }} onClick={() => router.push('/lawfirms/add-author')}>
                    Add Author
                </Button>
                <Button variant="outlined" onClick={() => router.push('/lawfirms/manage-authors')}>
                    Manage Authors
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
                {metrics.recent_activities.length === 0 ? (
                    <Typography>No recent activities.</Typography>
                ) : (
                    metrics.recent_activities.map((activity, index) => (
                        <Card key={index} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="body1">{activity.description}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {new Date(activity.timestamp).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </Container>
    );
};

export default LawFirmDashboard;
