'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Grid, Card, CardContent, TextField, MenuItem } from '@mui/material';

// Sample data for articles
const articlesData = [
    { id: 1, title: 'Understanding Criminal Law', author: 'Jane Doe', date: '2024-09-01' },
    { id: 2, title: 'Introduction to Civil Rights', author: 'John Smith', date: '2024-08-30' },
    { id: 3, title: 'Basics of Contract Law', author: 'Jane Doe', date: '2024-08-29' },
];

// Sample data for authors
const authors = ['Jane Doe', 'John Smith'];

const ViewAllArticles = () => {
    const router = useRouter();
    const [filteredArticles, setFilteredArticles] = useState(articlesData);
    const [selectedAuthor, setSelectedAuthor] = useState('');

    const handleAuthorFilterChange = (event) => {
        const author = event.target.value;
        setSelectedAuthor(author);
        if (author) {
            setFilteredArticles(articlesData.filter((article) => article.author === author));
        } else {
            setFilteredArticles(articlesData);
        }
    };

    // Function to handle article click
    const handleArticleClick = (id) => {
        router.push(`/lawfirms/articles/${id}`);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Title */}
            <Typography variant="h4" gutterBottom>
                All Articles
            </Typography>

            {/* Filter by Author */}
            <Box sx={{ mb: 4 }}>
                <TextField
                    select
                    label="Filter by Author"
                    value={selectedAuthor}
                    onChange={handleAuthorFilterChange}
                    variant="outlined"
                    fullWidth
                >
                    <MenuItem value="">All Authors</MenuItem>
                    {authors.map((author) => (
                        <MenuItem key={author} value={author}>
                            {author}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {/* Articles List */}
            <Grid container spacing={4}>
                {filteredArticles.map((article) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={article.id}
                        className="pointer"
                        onClick={() => handleArticleClick(article.id)} // Navigate to detail page on click
                    >
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{article.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Author: {article.author}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Date: {article.date}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ViewAllArticles;
