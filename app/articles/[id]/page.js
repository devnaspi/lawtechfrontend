'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationOn } from '@mui/icons-material';
import { Container, Box, Typography, Avatar, Grid, Paper, CircularProgress, Stack, Card, CardMedia, CardContent, IconButton, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Sample data for the main article
const cardData = {
    cover: 'https://picsum.photos/800/450?random=1',
    area: 'Administrative Law',
    title: 'Revolutionizing software development with cutting-edge tools',
    description:
        'Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.',
    body:
        'Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.',
    authors: [
        { name: 'Remy Sharp', avatar: '/static/images/avatar/1.jpg' },
        { name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' },
    ],
    created_at: 'July 14, 2021',
    region: 'Africa',
};

// Sample data for similar articles
const similarArticles = [
    {
        id: 2,
        cover: 'https://picsum.photos/800/450?random=2',
        title: 'Innovative product features that drive success',
        description: 'Explore the key features of our latest product release...',
        area: 'Civil Rights Law',
    },
    {
        id: 3,
        cover: 'https://picsum.photos/800/450?random=3',
        title: 'How to build scalable applications in 2024',
        description: 'Scalability is key for modern applications...',
        area: 'Technology Law',
    },
];

const ArticleDetails = ({ params }) => {
    const router = useRouter();
    const { id } = params.id; // Get the article ID from the route
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]); // State to store comments
    const [commentInput, setCommentInput] = useState(''); // State for new comment input

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

    const handleCommentSubmit = () => {
        if (commentInput.trim()) {
            // Add the new comment to the list of comments
            setComments((prevComments) => [...prevComments, { text: commentInput, date: new Date().toLocaleString() }]);
            setCommentInput(''); // Clear the input field
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
                
                {/* Comment Input */}
                <Box sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Add a comment"
                        variant="outlined"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                    />
                    {/* Align Submit Button to the Right */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" onClick={handleCommentSubmit}>
                            Submit Comment
                        </Button>
                    </Box>
                </Box>

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
                        No comments yet. Be the first to comment!
                    </Typography>
                )}
            </Box>


            {/* Read More Section */}
            <Box sx={{ mt: 8 }}>
                <Typography variant="h5" gutterBottom>
                    Read More
                </Typography>
                <Grid container spacing={4}>
                    {similarArticles.map((article) => (
                    <Grid item xs={12} sm={6} md={4} key={article.id}>
                        <Card
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%', // Make card height consistent
                        }}
                        onClick={() => router.push(`/articles/${article.id}`)}
                        >
                        <CardMedia
                            component="img"
                            image={article.cover}
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
                            <Typography variant="body2" color="textSecondary">
                            {article.description}
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
