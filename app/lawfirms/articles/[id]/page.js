'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import { Container, Box, Typography, Grid, Paper, CircularProgress, Stack, Card, CardMedia, CardContent } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axiosInstance from '@/lib/axios';

const LawFirmArticleDetails = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [article, setArticle] = useState(null);
    const [similarArticles, setSimilarArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticle();
        fetchSimilarArticles();
    }, [id]);

    const fetchArticle = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/articles/${id}/`);
            setArticle(response.data);
        } catch (error) {
            console.error('Error fetching article:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarArticles = async () => {
        try {
            const response = await axiosInstance.get(`/api/articles/${id}/read-more/?limit=4`);
            setSimilarArticles(response.data.results);
        } catch (error) {
            console.error('Failed to fetch similar articles:', error);
        }
    };

    const handleDownloadPDF = () => {
        const input = document.getElementById('article-content');
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save(`${article.title}.pdf`);
        });
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
                src={article.cover_picture || 'https://via.placeholder.com/800x450'}
                alt="cover img"
                sx={{
                    width: '100%',
                    maxHeight: '350px',
                    objectFit: 'cover',
                    borderRadius: 2,
                    mb: 4,
                }}
            />

            {/* Share and Download Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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

                <Stack direction="row" spacing={2}>
                    <Typography variant="body2" onClick={handleDownloadPDF} style={{ cursor: 'pointer' }}>
                        Download as PDF
                    </Typography>
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
                                    height: '100%',
                                }}
                                onClick={() => router.push(`/lawfirms/articles/${article.id}`)}
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

export default LawFirmArticleDetails;
