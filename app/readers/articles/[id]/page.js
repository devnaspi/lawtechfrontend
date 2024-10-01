'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { Container, Box, Typography, Avatar, Grid, Paper, CircularProgress, Stack, Card, CardMedia, CardContent, IconButton, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axiosInstance from '@/lib/axios';

const ArticleDetails = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [article, setArticle] = useState(null);
    const [similarArticles, setSimilarArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        fetchArticle();
        fetchSimilarArticles();
    }, [id]);

    const fetchArticle = async () => {
        try {
            const response = await axiosInstance.get(`/api/articles/${id}`);
            setArticle(response.data);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        } finally {
            setLoading(false); 
        }
    };

    const fetchSimilarArticles = async () => {
        try {
            const response = await axiosInstance.get(`/api/articles/${id}/read-more/?limit=4`);
            setSimilarArticles(response.data.results);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        } finally {
            setLoading(false); 
        }
    }

    const handleBookmarkToggle = () => {
        setIsBookmarked((prevState) => !prevState); // Toggle bookmark state
    };

    if (loading) {
        return (
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Container>
        );
    }

    if (!article) {
        return (
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5">Article not found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 20, mb: 4 }}>
            {/* Cover Photo */}
            <Box
                component="img"
                src={article.cover_picture}
                alt={"cover img"}
                sx={{
                    width: '100%',
                    maxHeight: '350px',
                    objectFit: 'cover',
                    borderRadius: 2,
                    mb: 4,
                }}
            />

            {/* Share, Bookmark and Download Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                {/* Share Buttons */}
                <Stack direction="row" spacing={2}>
                    <FacebookShareButton url={window.location.href} quote={article.title}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={window.location.href} title={article.title}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <WhatsappShareButton url={window.location.href} title={article.title}>
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </Stack>

                {/* Bookmark and Download Buttons */}
                <Stack direction="row" spacing={2}>
                    <IconButton onClick={handleBookmarkToggle}>
                        {isBookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
                    </IconButton>
                </Stack>
            </Box> 

            {/* Article Title */}
            <Typography variant="h3" gutterBottom>
                {article.title}
            </Typography>

            {/* Main Content */}
            <div id="article-content">
                {/* Article Body */}
                <Paper sx={{ p: 4 }}>
                    <Typography 
                    variant="body1" 
                    sx={{ lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </Paper>
            </div>

            {/* Read More Section */}
            <Box sx={{ mt: 8 }}>
                <Typography variant="h5" gutterBottom>
                    Read More
                </Typography>
                <Grid container spacing={4}>
                    {similarArticles.map((article) => (
                    <Grid item xs={6} sm={4} md={3} key={article.id}>
                        <Card
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%', // Make card height consistent
                        }}
                        onClick={() => router.push(`/readers/articles/${article.id}`)}
                        >
                        <CardMedia
                            component="img"
                            image={article.cover_picture}
                            alt={article.title}
                            sx={{
                            height: 140, // Set fixed height for the image
                            objectFit: 'cover', // Cover the area without distorting the image
                            }}
                        />
                        <CardContent
                            sx={{
                            flexGrow: 1, // Allow content to grow and fill available space
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="subtitle1" gutterBottom>
                                {article.title}
                            </Typography>
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
                        </Card>
                    </Grid>
                    ))}
                </Grid>
            </Box>

        </Container>
    );
};

export default ArticleDetails;
