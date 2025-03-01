'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Grid, Card, CardContent, CardMedia, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import axiosInstance from '@/lib/axios';
import StyledTypography from '../components/StyledTypography';
import Author from '../components/Author';

const Explore = () => {
    const [selectedCategory, setSelectedCategory] = useState('Any');
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('Any');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const router = useRouter();

    const fetchCategories = async () => {
        setLoading(true);

        try {
            const response = await axiosInstance.get('/api/tags');
            const results = response.data.results;
            setCategories(results);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
        setLoading(false);
    };
    
    const fetchCountries = async () => {
        setLoading(true);

        try {
            const response = await axiosInstance.get('/api/categories/countries');
            const results = response.data;
            setCountries(results);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
        setLoading(false);
    };

    const fetchArticles = async () => {
        setLoading(true);
        setArticles([]); 
        setNoResults(false);

        try {
            const params = {
                tag: selectedCategory !== 'Any' ? selectedCategory : undefined,
                country: selectedCountry !== 'Any' ? selectedCountry : undefined,
            };
            
            const response = await axiosInstance.get('/api/articles/', { params });
            const results = response.data.results;

            if (results.length > 0) {
                setArticles(results);
            } else {
                setNoResults(true);
            }
        } catch (error) {
            console.error("Error fetching articles:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
        fetchCountries();
        fetchArticles();
    }, [selectedCategory, selectedCountry]);

    return (
        <Container maxWidth="lg" sx={{ mt: 20, mb: 4, minHeight: '70vh' }}>
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
                            <MenuItem value="Any">Any</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.name} sx={{ textTransform: 'capitalize' }}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Country</InputLabel>
                        <Select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                        >
                            <MenuItem value="Any">Any</MenuItem>
                            {countries.map((country) => (
                                <MenuItem key={country.id} value={country.name} sx={{ textTransform: 'capitalize' }}>
                                    {country.name}
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

            {loading ? (
                <Box display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {articles.length > 0 ? (
                        articles.map((article) => (
                            <Grid item xs={12} sm={6} md={4} key={article.id}>
                                <Card
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => router.push(`/readers/articles/${article.id}`)}
                                >
                                    <CardMedia
                                        component="img"
                                        image={article.cover_picture}
                                        alt={article.title}
                                        sx={{ height: 220, objectFit: 'cover' }}
                                    />
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {article.title}
                                        </Typography>
                                        <StyledTypography 
                                        variant="body2" 
                                        color="textSecondary"
                                        dangerouslySetInnerHTML={{ __html: article.content }}
                                        />
                                        
                                    </CardContent>
                                    <Author 
                                    authors={[article.author]} 
                                    created_at={article.created_at} 
                                    company={{
                                        name: article.author.lawfirm.name,
                                        logo: article.author.lawfirm.user?.profile_picture
                                    }}
                                    />
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
                                    minHeight: '200px',
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
            )}

        </Container>
    );
};

export default Explore;
