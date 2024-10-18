'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios'
import CircularProgress from '@mui/material/CircularProgress';


const ManageArticles = () => {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const router = useRouter();


    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axiosInstance.get('/api/authors/articles');
                setArticles(response.data.results);
            } catch (error) {
                console.error('Failed to fetch articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleEditArticle = (id) => {
        router.push(`/authors/edit-article/${id}`);
    };

    const handleDeleteArticle = async () => {
        if (selectedArticle) {
            try {
                await axiosInstance.delete(`/api/articles/${selectedArticle}/`);
                setArticles(articles.filter(article => article.id !== selectedArticle));
                setOpenDialog(false);
            } catch (error) {
                console.error('Failed to delete article:', error);
            }
        }
    };

    const openConfirmationDialog = (id) => {
        setSelectedArticle(id);
        setOpenDialog(true);
    };

    const closeConfirmationDialog = () => {
        setOpenDialog(false);
        setSelectedArticle(null);
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
            {/* Title */}
            <Typography variant="h4" gutterBottom>
                Manage Articles
            </Typography>

            {/* Articles List */}
            <Grid container spacing={4}>
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <Grid item xs={12} sm={6} md={4} key={article.id}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6">{article.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Reads: {article.reads_count}, Shares: {article.shares_count}, Bookmarks: {article.bookmarks_count}
                                    </Typography>
                                </CardContent>

                                {/* Action Buttons */}
                                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                    <IconButton color="primary" onClick={() => handleEditArticle(article.id)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => openConfirmationDialog(article.id)}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
                        No articles found.
                    </Typography>
                )}
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={closeConfirmationDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this article? This action is irreversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmationDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteArticle} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageArticles;
