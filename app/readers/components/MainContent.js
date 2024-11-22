import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Author from './Author';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
        backgroundColor: theme.palette.grey[200],
        cursor: 'pointer',
    },
    '&:focus-visible': {
        outline: `3px solid ${theme.palette.primary.main}`,
        outlineOffset: '2px',
    },
}));

const StyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: '10px 10px 5px 10px',
    flexGrow: 1,
});

export default function MainContent() {
    const router = useRouter();
    const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleFocus = (index) => {
        setFocusedCardIndex(index);
    };

    const handleCardClick = (id) => {
        router.push(`/readers/articles/${id}`);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axiosInstance.get('/api/articles/');
                setArticles(response.data.results);
            } catch (error) {
                console.error('Failed to fetch articles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Grid container spacing={2} columns={12}>
                {articles.map((article, index) => (
                    <Grid key={article.id} item xs={12} sm={6} md={3} onClick={() => handleCardClick(article.id)}>
                        <StyledCard
                            variant="outlined"
                            onFocus={() => handleFocus(index)}
                            onBlur={handleBlur}
                            tabIndex={0}
                            className={focusedCardIndex === index ? 'Mui-focused' : ''}
                        >
                            <CardMedia
                                component="img"
                                alt="cover"
                                image={article.cover_picture}
                                sx={{
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}
                            />
                            <StyledCardContent>
                                <Typography gutterBottom variant="h6" color="text.primary" component="div">
                                    {article.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom dangerouslySetInnerHTML={{ __html: article.content }} />
                            </StyledCardContent>
                            <Author authors={[article.author]} created_at={article.created_at} />
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
