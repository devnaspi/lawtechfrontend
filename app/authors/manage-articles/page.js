'use client';

import React, { useState } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// Sample data for articles
const articlesData = [
    { id: 1, title: 'Understanding Criminal Law', reads: 120, shares: 45, bookmarks: 30 },
    { id: 2, title: 'How to Build Scalable Applications in 2024', reads: 200, shares: 60, bookmarks: 50 },
];

const ManageArticles = () => {
    const [articles, setArticles] = useState(articlesData);
    const router = useRouter()

    const handleEditArticle = (id) => {
        // Logic to navigate to edit article page
        router.push('/authors/edit-article/3')
    };

    const handleDeleteArticle = (id) => {
        // Logic to delete an article
        setArticles(articles.filter(article => article.id !== id));
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Title */}
            <Typography variant="h4" gutterBottom>
                Manage Articles
            </Typography>

            {/* Articles List */}
            <Grid container spacing={4}>
                {articles.map((article) => (
                    <Grid item xs={12} sm={6} md={4} key={article.id}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{article.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Reads: {article.reads}, Shares: {article.shares}, Bookmarks: {article.bookmarks}
                                </Typography>
                            </CardContent>

                            {/* Action Buttons */}
                            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                <IconButton color="primary" onClick={() => handleEditArticle(article.id)}>
                                    <Edit />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDeleteArticle(article.id)}>
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ManageArticles;
