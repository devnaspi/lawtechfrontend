'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Grid, Card, CardContent, CardMedia, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// Law categories
const lawAreas = ['Administrative Law', 'Civil Rights Law', 'Criminal Law', 'Family Law', 'Technology Law'];
const regions = ['Africa', 'Asia', 'Europe', 'North America', 'South America'];

// Sample data for articles
const articlesData = [
    {
        id: 1,
        cover: 'https://picsum.photos/800/450?random=1',
        title: 'Revolutionizing software development with cutting-edge tools',
        description: 'Discover how these innovations are transforming the software development landscape.',
        area: 'Technology Law',
        region: 'North America',
    },
    {
        id: 2,
        cover: 'https://picsum.photos/800/450?random=2',
        title: 'Innovative product features that drive success',
        description: 'Explore the key features of our latest product release...',
        area: 'Civil Rights Law',
        region: 'Europe',
    },
    {
        id: 3,
        cover: 'https://picsum.photos/800/450?random=3',
        title: 'How to build scalable applications in 2024',
        description: 'Scalability is key for modern applications...',
        area: 'Technology Law',
        region: 'Asia',
    },
    // Add more articles as needed
];

const Explore = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [filteredArticles, setFilteredArticles] = useState(articlesData);
    const router = useRouter();

    // Update filtered articles based on selected filters
    useEffect(() => {
        const filtered = articlesData.filter(article => {
            return (
                (selectedCategory ? article.area === selectedCategory : true) &&
                (selectedRegion ? article.region === selectedRegion : true)
            );
        });
        setFilteredArticles(filtered);
    }, [selectedCategory, selectedRegion]);

    return (
        <Container maxWidth="lg" sx={{ mt: 20, mb: 4, minHeight: '70vh' }}>
            {/* Title */}
            <Typography variant="h4" gutterBottom mb={3}>
                Explore
            </Typography>

            {/* Filters */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            {lawAreas.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Region</InputLabel>
                        <Select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                            <MenuItem value="">All Regions</MenuItem>
                            {regions.map((region) => (
                                <MenuItem key={region} value={region}>
                                    {region}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Display Filtered Articles */}
            <Typography variant="h5" gutterBottom>
                Articles
            </Typography>
            <Grid container spacing={4}>
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                        <Grid item xs={12} sm={6} md={4} key={article.id}>
                            <Card
                                sx={{ cursor: 'pointer' }}
                                onClick={() => router.push(`/readers/articles/${article.id}`)}
                            >
                                <CardMedia
                                    component="img"
                                    image={article.cover}
                                    alt={article.title}
                                    sx={{
                                        height: 140, // Fixed height for the image
                                        objectFit: 'cover', // Cover the area without distorting the image
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {article.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {article.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '200px', // Adjust height as needed
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="h6" color="textSecondary">
                                No articles found for the selected filters.
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

        </Container>
    );
};

export default Explore;
