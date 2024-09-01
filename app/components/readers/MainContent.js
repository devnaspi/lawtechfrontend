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

const cardData = [
        {
            id: 1,
            cover: 'https://picsum.photos/800/450?random=1',
            area: 'Administrative Law',
            region: 'Africa',
            title: 'Revolutionizing software development with cutting-edge tools',
            description:
                'Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.',
            authors: [
                { name: 'Remy Sharp', avatar: '/static/images/avatar/1.jpg' },
                { name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' },
            ],
            created_at: 'July 14, 2021'
        },
        {
            id: 2,
            cover: 'https://picsum.photos/800/450?random=2',
            area: 'Civil Rights Law',
            title: 'Innovative product features that drive success',
            description:
                'Explore the key features of our latest product release that are helping businesses achieve their goals. From user-friendly interfaces to robust functionality, learn why our product stands out.',
            authors: [{ name: 'Erica Johns', avatar: '/static/images/avatar/6.jpg' }],
            created_at: 'July 14, 2021'
        }
];

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

        const handleFocus = (index) => {
            setFocusedCardIndex(index);
        };

        const handleCardClick = (id) => {
            router.push(`/articles/${id}`); // Navigate to the article details page
        };        

        const handleBlur = () => {
            setFocusedCardIndex(null);
        };

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Grid container spacing={2} columns={12}>
                    <Grid size={{ xs: 6, md: 4 }} onClick={() => handleCardClick(cardData[0].id)}>
                        <SyledCard
                        variant="outlined"
                        onFocus={() => handleFocus(0)}
                        onBlur={handleBlur}
                        tabIndex={0}
                        className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
                        >
                        <CardMedia
                            component="img"
                            alt="green iguana"
                            image={cardData[0].cover}
                            aspect-ratio="16 / 9"
                            sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            }}
                        />
                        <SyledCardContent>
                            <Typography gutterBottom variant="caption" component="div">
                            {cardData[0].area}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                            {cardData[0].title}
                            </Typography>
                            <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            {cardData[0].description}
                            </StyledTypography>
                        </SyledCardContent>
                        <Author authors={cardData[0].authors} created_at={cardData[0].created_at} />
                        </SyledCard>
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }} onClick={() => handleCardClick(cardData[1].id)}>
                        <SyledCard
                        variant="outlined"
                        onFocus={() => handleFocus(1)}
                        onBlur={handleBlur}
                        tabIndex={0}
                        className={focusedCardIndex === 1 ? 'Mui-focused' : ''}
                        >
                        <CardMedia
                            component="img"
                            alt="green iguana"
                            image={cardData[1].cover}
                            aspect-ratio="16 / 9"
                            sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            }}
                        />
                        <SyledCardContent>
                            <Typography gutterBottom variant="caption" component="div">
                            {cardData[1].area}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                            {cardData[1].title}
                            </Typography>
                            <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            {cardData[1].description}
                            </StyledTypography>
                        </SyledCardContent>
                        <Author authors={cardData[1].authors} created_at={cardData[1].created_at} />
                        </SyledCard>
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }} onClick={() => handleCardClick(cardData[1].id)}>
                        <SyledCard
                        variant="outlined"
                        onFocus={() => handleFocus(1)}
                        onBlur={handleBlur}
                        tabIndex={0}
                        className={focusedCardIndex === 1 ? 'Mui-focused' : ''}
                        >
                        <CardMedia
                            component="img"
                            alt="green iguana"
                            image={cardData[1].cover}
                            aspect-ratio="16 / 9"
                            sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            }}
                        />
                        <SyledCardContent>
                            <Typography gutterBottom variant="caption" component="div">
                            {cardData[1].area}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                            {cardData[1].title}
                            </Typography>
                            <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            {cardData[1].description}
                            </StyledTypography>
                        </SyledCardContent>
                        <Author authors={cardData[1].authors} created_at={cardData[1].created_at} />
                        </SyledCard>
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }} onClick={() => handleCardClick(cardData[1].id)}>
                        <SyledCard
                        variant="outlined"
                        onFocus={() => handleFocus(1)}
                        onBlur={handleBlur}
                        tabIndex={0}
                        className={focusedCardIndex === 1 ? 'Mui-focused' : ''}
                        >
                        <CardMedia
                            component="img"
                            alt="green iguana"
                            image={cardData[1].cover}
                            aspect-ratio="16 / 9"
                            sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            }}
                        />
                        <SyledCardContent>
                            <Typography gutterBottom variant="caption" component="div">
                            {cardData[1].area}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                            {cardData[1].title}
                            </Typography>
                            <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            {cardData[1].description}
                            </StyledTypography>
                        </SyledCardContent>
                        <Author authors={cardData[1].authors} created_at={cardData[1].created_at} />
                        </SyledCard>
                    </Grid>
                </Grid>
            </Box>
        );
}