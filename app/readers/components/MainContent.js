import * as React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Author from './Author';
import {useRouter} from 'next/navigation';
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';

    const SyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
    },
    '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
    },
    }));

    const SyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
    paddingBottom: 16,
    },
    });

    const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    });

export default function MainContent() {
    const router = useRouter()
    const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);
    const [articles, setArticles] = useState([]); 
    const [loading, setLoading] = useState(true);

    const handleFocus = (index) => {
        setFocusedCardIndex(index);
    };

    const handleCardClick = (id) => {
        router.push(`readers/articles/${id}`);
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
                        <Grid size={{ xs: 4, md: 3 }} onClick={() => handleCardClick(article.id)}>
                            <SyledCard
                            variant="outlined"
                            onFocus={() => handleFocus(0)}
                            onBlur={handleBlur}
                            tabIndex={0}
                            className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
                            >
                            <CardMedia
                                component="img"
                                alt="cover"
                                image={article.cover_picture}
                                aspect-ratio="16 / 9"
                                sx={{
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                }}
                            />
                            <SyledCardContent>
                                <Typography gutterBottom variant="caption" component="div">
                                {article.area}
                                </Typography>
                                <Typography gutterBottom variant="h6" component="div">
                                {article.title}
                                </Typography>
                                <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                {article.description}
                                </StyledTypography>
                            </SyledCardContent>
                            <Author authors={[article.author]} created_at={article.created_at} />
                            </SyledCard>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
}