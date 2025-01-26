'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { Container, Box, Typography, Grid, Paper, CircularProgress, Stack, Card, CardMedia, CardContent, IconButton, Avatar } from '@mui/material';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import { Building2 } from 'lucide-react';

const ArticleDetails = ({ params }) => {
    const router = useRouter();
    const { code } = params;
    const [article, setArticle] = useState(null);
    const [similarArticles, setSimilarArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { auth } = useAuth(); 
    const { handleApiError } = useApiErrorHandler();


    useEffect(() => {
        fetchArticle();
        fetchSimilarArticles();
    }, [code]);

    const fetchArticle = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/articles/${code}`);
            setArticle(response.data);
            setIsBookmarked(response.data.is_bookmarked);

            if (article) {
                addToHistory();
            }
        } catch (error) {
            console.error('Failed to fetch article:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarArticles = async () => {
        try {
            const response = await axiosInstance.get(`/api/articles/${code}/read-more/?limit=4`);
            setSimilarArticles(response.data.results);
        } catch (error) {
            console.error('Failed to fetch similar articles:', error);
        }
    };

    const addToHistory = async () => {
        try {
            await axiosInstance.post('/api/history/', { article_id: article.id });
        } catch (error) {
            console.log(error)
            handleApiError(error)
        }
    };

    const handleBookmarkToggle = async () => {
        if (!auth.isAuthenticated) {
            router.push(`/readers/login?redirect=/readers/articles/${code}`);
            return;
        }

        try {
            if (isBookmarked) {
                await axiosInstance.post(`/api/articles/${code}/toggle-bookmark/`);
            } else {
                await axiosInstance.post(`/api/articles/${code}/toggle-bookmark/`);
            }
            setIsBookmarked((prevState) => !prevState);
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
        }
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
            {/* Law Firm Info */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 4
                }}
            >
                <Avatar
                    src={article.author.lawfirm.logo || undefined}
                    variant="rounded"
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        '& img': {
                            objectFit: 'contain',
                            p: 0,
                            width: '100%',
                            height: '100%'
                        }
                    }}
                >
                    <Building2 size={24} />
                </Avatar>
                <Typography 
                    variant="h6"
                    sx={{
                        color: 'text.primary',
                        fontWeight: 500
                    }}
                >
                    {article.author.lawfirm.name}
                </Typography>
            </Box>

            {/* Cover Photo */}
            <Box
                component="img"
                src={article.cover_picture}
                alt="cover img"
                sx={{
                    width: '100%',
                    maxHeight: '350px',
                    objectFit: 'cover',
                    borderRadius: 2,
                    mb: 4,
                }}
            />

            {/* Share, Bookmark, and Download Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                {/* Share Buttons */}
                <Stack direction="row" spacing={2}>
                    <FacebookShareButton url={window.location.href} quote={article.title} title={article.title}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={window.location.href} title={article.title}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <WhatsappShareButton url={window.location.href} title={article.title}>
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </Stack>

                {/* Bookmark Button */}
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
                <Paper sx={{ p: 4 }}>
                    <Typography 
                        variant="body1" 
                        sx={{ lineHeight: 1.8 }}
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            mt: 3,
                            pt: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        To learn more, contact{' '}
                        <Typography
                            component="a"
                            href={`${article.author.lawfirm.website || ''}`}
                            target="_blank"
                            sx={{
                                textDecoration: 'underline',
                                color: 'primary.main',
                                '&:hover': {
                                    color: 'primary.dark',
                                }
                            }}
                        >
                            {article.author.lawfirm.name}
                        </Typography>
                        {' '}here.
                    </Typography>
                </Paper>
            </div>

            {/* Contributing Authors Section */}
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 2,
                        fontWeight: 500
                    }}
                >
                    Contributing Author(s)
                </Typography>
                <Stack spacing={2}>
                    {Array.isArray(article.authors) ? article.authors.map((author, index) => (
                        <Box 
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <Avatar
                                src={author.avatar}
                                alt={author.user.username}
                                sx={{ width: 40, height: 40 }}
                            />
                            <Typography variant="body1">
                                {author.user.username}
                            </Typography>
                        </Box>
                    )) : (
                        <Box 
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <Avatar
                                src={article.author.avatar}
                                alt={article.author.user.username}
                                sx={{ width: 40, height: 40 }}
                            />
                            <Typography variant="body1">
                                {article.author.user.username}
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Paper>

            {/* Read More Section */}
            <Box sx={{ mt: 8 }}>
                <Typography variant="h5" gutterBottom>
                    Read More
                </Typography>
                <Grid container spacing={4}>
                    {similarArticles.map((article) => (
                    <Grid item xs={6} sm={4} md={3} key={article.code}>
                        <Card
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                        }}
                        onClick={() => router.push(`/readers/articles/${article.code}`)}
                        >
                        <CardMedia
                            component="img"
                            image={article.cover_picture}
                            alt={article.title}
                            sx={{
                            height: 140,
                            objectFit: 'cover',
                            }}
                        />
                        <CardContent
                            sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="subtitle1" gutterBottom>
                                {article.title}
                            </Typography>
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
