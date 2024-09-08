// app/lawfirms/view-article.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import { Container, Box, Typography, Grid, Paper, CircularProgress, Stack, CardMedia, CardContent, IconButton, List, ListItem, ListItemText } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Sample data for the main article
const cardData = {
    cover: 'https://picsum.photos/800/450?random=1',
    area: 'Administrative Law',
    title: 'Revolutionizing software development with cutting-edge tools',
    description: 'Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.',
    body: 'Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.',
    authors: [
        { name: 'Remy Sharp', avatar: '/static/images/avatar/1.jpg' },
        { name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' },
    ],
    created_at: 'July 14, 2021',
    region: 'Africa',
};

// Sample comments data
const sampleComments = [
    { text: 'Great article! Very informative.', date: '2024-09-05 14:30' },
    { text: 'I found this very helpful, thank you!', date: '2024-09-06 10:15' },
];

const LawFirmArticleDetails = ({ params }) => {
    const router = useRouter();
    const { id } = params.id; // Get the article ID from the route
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState(sampleComments); // State to store comments

    useEffect(() => {
        // Simulate fetching article data
        setArticle(cardData);
    }, [id]);

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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Cover Photo */}
            <Box
                component="img"
                src={article.cover}
                alt={article.title}
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

                {/* Download Button */}
                <IconButton onClick={handleDownloadPDF}>
                    <Typography variant="body2">Download as PDF</Typography>
                </IconButton>
            </Box>

            {/* Article Title */}
            <Typography variant="h3" gutterBottom>
                {article.title}
            </Typography>

            {/* Main Content */}
            <div id="article-content">
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {/* ... Existing content ... */}
                </Grid>

                {/* Article Body */}
                <Paper sx={{ p: 4 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        {article.body}
                    </Typography>
                </Paper>
            </div>

            {/* Comments Section */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" gutterBottom>
                    Comments
                </Typography>

                {/* Display Comments */}
                {comments.length > 0 ? (
                    <List>
                        {comments.map((comment, index) => (
                            <ListItem key={index} alignItems="flex-start">
                                <ListItemText
                                    primary={comment.text}
                                    secondary={`Posted on ${comment.date}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        No comments yet.
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default LawFirmArticleDetails;
