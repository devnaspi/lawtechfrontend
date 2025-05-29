'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

const Dashboard = () => {
    const router = useRouter();
    const [metrics, setMetrics] = useState({
        total_articles: 0,
        total_reads: 0,
        total_bookmarks: 0,
        total_shares: 0,
        recent_articles: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await axiosInstance.get('/api/authors/summary');
                setMetrics(response.data);
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Title */}
            <Typography variant="h4" gutterBottom mb={5}>
                Welcome back,
            </Typography>

            {/* Metrics Cards */}
            <Grid container spacing={4}>
                <Grid item xs={12} sm={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Articles
                            </Typography>
                            <Typography variant="h3">{metrics.total_articles}</Typography>
                        </CardContent>
                    </Card>
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
                <Button variant="contained" sx={{ mr: 2 }} onClick={() => router.push('/authors/create-article')}>
                    Create Article
                </Button>
                <Button variant="outlined" onClick={() => router.push('/authors/manage-articles')}>
                    Manage Articles
                </Button>
            </Box>

            {/* Recent Articles */}
            <Typography variant="h5" gutterBottom>
                Recent Articles
            </Typography>
            <Box sx={{ mt: 2 }}>
                {metrics.recent_articles.length === 0 ? (
                    <Typography>No recent articles.</Typography>
                ) : (
                    metrics.recent_articles.map((article) => (
                        <Card key={article.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{article.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Last edited on {new Date(article.created_at).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </Container>
    );
};

export default Dashboard;
