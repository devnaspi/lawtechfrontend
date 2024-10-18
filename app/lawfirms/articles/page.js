'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, CardActionArea } from '@mui/material';
import axiosInstance from '@/lib/axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';

const LawFirmArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axiosInstance.get('/api/lawfirms/articles/');
                setArticles(response.data);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleArticleClick = (id) => {
        router.push(`/lawfirms/articles/${id}`);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Articles by Law Firm Authors
            </Typography>

            {articles.length > 0 ? (
                <Grid container spacing={4}>
                    {articles.map((article) => (
                        <Grid item xs={12} sm={6} md={4} key={article.id}>
                            <Card>
                                <CardActionArea onClick={() => handleArticleClick(article.id)}>
                                    <CardContent>
                                        <Typography variant="h6">{article.title}</Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                WebkitLineClamp: 2,
                                                textOverflow: 'ellipsis',
                                            }}
                                            dangerouslySetInnerHTML={{ __html: article.content }}
                                        />
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Typography variant="h6" color="textSecondary">
                        No articles found.
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default LawFirmArticles;
