'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Avatar, Grid, Paper, CircularProgress } from '@mui/material';

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
        created_at: 'July 14, 2021'
}

const ArticleDetails = ({ params }) => {
    const router = useRouter();
    const { id } = params.id; // Get the article ID from the route
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    //     if (id) {
    //         // Fetch article data from the backend API (replace with your API endpoint)
    //         fetch(`/api/articles/${id}`)
    //             .then((response) => response.json())
    //             .then((data) => {
    //             setArticle(data);
    //             setLoading(false);
    //             })
    //             .catch((error) => {
    //             console.error('Error fetching article:', error);
    //             setLoading(false);
    //             });
    //         }
        setArticle(cardData)
    }, [id]);

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
        <Container maxWidth="md" sx={{ mt: 20, mb: 4 }}>
        {/* Cover Photo */}
        <Box
            component="img"
            src={article.cover}
            alt={article.title}
            sx={{
            width: '100%',
            maxHeight: '350px', // Set maximum height for the image
            objectFit: 'cover', // Maintain aspect ratio while covering the box
            borderRadius: 2,
            mb: 4,
            }}
        />

        {/* Article Title */}
        <Typography variant="h3" gutterBottom>
            {article.title}
        </Typography>

        {/* Article Metadata */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item>
            <Typography variant="body2" color="textSecondary">
                By{' '}
                {article.authors.map((author, index) => (
                <React.Fragment key={index}>
                    {index > 0 && ', '}
                    <Typography component="span" variant="body2" color="textPrimary">
                    {author.name}
                    </Typography>
                </React.Fragment>
                ))}
            </Typography>
            </Grid>
            <Grid item>
            <Typography variant="body2" color="textSecondary">
                Created on {new Date(article.created_at).toLocaleDateString()}
            </Typography>
            </Grid>
        </Grid>

        {/* Article Body */}
        <Paper sx={{ p: 4 }}>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {article.body}
            </Typography>
        </Paper>

        {/* Authors Section */}
        <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>
            About the Authors
            </Typography>
            <Grid container spacing={2}>
            {article.authors.map((author, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar alt={author.name} src={author.avatar} />
                    <Box>
                    <Typography variant="subtitle1">{author.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        {author.bio}
                    </Typography>
                    </Box>
                </Box>
                </Grid>
            ))}
            </Grid>
        </Box>
        </Container>
    );
};

export default ArticleDetails;
