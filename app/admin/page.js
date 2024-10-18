'use client';

import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button, Avatar } from '@mui/material';

const metrics = {
    shares: 120,
    reads: 450,
    bookmarks: 80,
};

const recentArticles = [
    { id: 1, title: 'Understanding Criminal Law', lastEdited: '2024-09-02' },
    { id: 2, title: 'How to Build Scalable Applications in 2024', lastEdited: '2024-09-01' },
    { id: 3, title: 'Effective Legal Writing', lastEdited: '2024-08-30' },
];

const Dashboard = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 20, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Author Dashboard
            </Typography>

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

            <Box sx={{ mt: 4, mb: 4 }}>
                <Button variant="contained" sx={{ mr: 2 }} onClick={() => {/* Navigate to create article */}}>
                    Create Article
                </Button>
                <Button variant="outlined" onClick={() => {/* Navigate to manage articles */}}>
                    Manage Articles
                </Button>
            </Box>

            {/* Recent Articles */}
            <Typography variant="h5" gutterBottom>
                Recent Articles
            </Typography>
            <Box sx={{ mt: 2 }}>
                {recentArticles.map((article) => (
                    <Card key={article.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{article.title}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Last edited on {article.lastEdited}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
};

export default Dashboard;
