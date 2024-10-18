'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Avatar,
    Button,
    Divider,
    IconButton,
    TextField,
    Stack,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import { useSnackbar } from 'notistack';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import StyledTypography from '../components/StyledTypography';
import Author from '../components/Author';
import Grid from '@mui/material/Grid2';


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
    gap: 2,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 5,
    flexGrow: 1,
});

const EditProfile = () => {
    const { handleApiError } = useApiErrorHandler();
    const { auth, setAuth, loading, logout } = useAuth();
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState('/static/images/avatar/1.jpg');
    
    const [password, setPassword] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);
    const [success, setSuccess] = useState(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [bookmarks, setBookmarks] = useState([]);
    const [readArticles, setReadArticles] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);

    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfilePicturePreview(imageUrl);
            setProfilePicture(file);
        }
    };

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
        if (!loading && name === '') {
            setName(auth.user?.username || '');
        }
        if (!loading && email === '') {
            setEmail(auth.user?.email || '');
        }
        if (!loading && profilePicturePreview === '/static/images/avatar/1.jpg') {
            setProfilePicturePreview(auth.user?.profile_picture || '/static/images/avatar/1.jpg');
        }
    }, [loading, auth]);

    const handleSaveChanges = async () => {
        setSuccess(null);
        try {
            const formData = new FormData();
            formData.append('username', name);
            formData.append('email', email);
            if (password) {
                formData.append('password', password);
            }
            if (profilePicture) {
                formData.append('profile_picture', profilePicture);
            }

            await axiosInstance.put('/api/users/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const response = await axiosInstance.get('/api/users/profile');
            const updatedUser = response.data;

            setAuth((prevAuth) => ({
                ...prevAuth,
                user: updatedUser,
            }));
            setSuccess('Profile updated successfully');
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);

        if (newValue === 1) {
            fetchBookmarks();
        } else if (newValue === 2) {
            fetchReadArticles();
        }
    };

    const fetchBookmarks = async () => {
        setLoadingData(true);
        try {
            const response = await axiosInstance.get('/api/bookmarks/');
            setBookmarks(response.data.results);
        } catch (err) {
            handleApiError(err);
        } finally {
            setLoadingData(false);
        }
    };

    const fetchReadArticles = async () => {
        setLoadingData(true);
        try {
            const response = await axiosInstance.get('/api/history/');
            setReadArticles(response.data.results);
        } catch (err) {
            handleApiError(err);
        } finally {
            setLoadingData(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/api/users/auth/logout');

            logout();
            enqueueSnackbar('Logout successful!', { variant: 'success' });
            router.push('/readers');
        } catch (err) {
            handleApiError(err);
        }
    }

    return (
        <Container maxWidth="lg" sx={{ mb: 8, minHeight: '100vh', display: 'flex', position: 'relative' }}>
            {/* Side Panel with Tabs */}
            <Box
                sx={{
                    width: '250px',
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    height: '70vh',
                    borderRight: 1,
                    borderColor: 'divider',
                    pt: 10,
                    bgcolor: 'background.paper',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                }}
            >
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={selectedTab}
                    onChange={handleTabChange}
                    sx={{ width: '100%' }}
                >
                    <Tab label="Edit Profile" sx={{ alignItems: 'flex-start' }} />
                    <Tab label="Bookmarks" sx={{ alignItems: 'flex-start' }} />
                    <Tab label="Read Articles" sx={{ alignItems: 'flex-start' }} />
                </Tabs>

                {/* Logout Button */}
                <Button
                    color="error"
                    variant="text"
                    size="small"
                    sx={{ m: 2 }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>

            {/* Main Content Area */}
            <Box
                sx={{
                    flexGrow: 1,
                    marginLeft: '150px',
                    paddingTop: 10,
                }}
            >
                {selectedTab === 0 && (
                    <>
                        {/* Edit Profile Content */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Avatar
                                alt={name}
                                src={profilePicturePreview}
                                sx={{ width: 100, height: 100, mx: 'auto' }}
                            />
                            <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="label"
                                sx={{ mt: -3, ml: 3 }}
                            >
                                <input hidden accept="image/*" type="file" onChange={handleProfilePictureChange} />
                                <PhotoCamera />
                            </IconButton>
                            <Typography variant="h6" gutterBottom>
                                {name}
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {success}
                            </Alert>
                        )}

                        <Typography variant="h6" gutterBottom>
                            User Information
                        </Typography>
                        <TextField
                            fullWidth
                            label="Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        {/* Account Settings Section */}
                        <Typography variant="h6" gutterBottom>
                            Account Settings
                        </Typography>
                        <TextField
                            fullWidth
                            label="New Password"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 4 }}
                        />

                        <Divider sx={{ mb: 4 }} />

                        {/* Save and Cancel Buttons */}
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Stack>
                    </>
                )}

                {selectedTab === 1 && (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Bookmarked Articles
                        </Typography>
                        {loadingData ? (
                            <CircularProgress />
                        ) : bookmarks.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <Grid container spacing={2} columns={12}>
                                        {bookmarks.map((bookmark, index) => (
                                            <Grid size={{ xs: 4, md: 3 }} onClick={() => handleCardClick(bookmark.article.id)}>
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
                                                        image={bookmark.article.cover_picture}
                                                        aspect-ratio="16 / 9"
                                                        sx={{
                                                        borderBottom: '1px solid',
                                                        borderColor: 'divider',
                                                        }}
                                                    />
                                                    <SyledCardContent>
                                                        <Typography gutterBottom variant="h6" component="div">
                                                        {bookmark.article.title}
                                                        </Typography>
                                                        <StyledTypography variant="body2" color="text.secondary" gutterBottom
                                                        dangerouslySetInnerHTML={{ __html: bookmark.article.content }} />
                                                    </SyledCardContent>
                                                    <Author authors={[bookmark.article.author]} created_at={bookmark.article.created_at} />
                                                </SyledCard>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                No bookmarks found.
                            </Typography>
                        )}
                    </>
                )}

                {selectedTab === 2 && (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Read Articles
                        </Typography>
                        {loadingData ? (
                            <CircularProgress />
                        ) : readArticles.length > 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <Grid container spacing={2} columns={12}>
                                        {readArticles.map((article, index) => (
                                            <Grid size={{ xs: 4, md: 3 }} onClick={() => handleCardClick(article.article.id)}>
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
                                                        image={article.article.cover_picture}
                                                        aspect-ratio="16 / 9"
                                                        sx={{
                                                        borderBottom: '1px solid',
                                                        borderColor: 'divider',
                                                        }}
                                                    />
                                                    <SyledCardContent>
                                                        <Typography gutterBottom variant="h6" component="div">
                                                        {article.article.title}
                                                        </Typography>
                                                        <StyledTypography variant="body2" color="text.secondary" gutterBottom
                                                        dangerouslySetInnerHTML={{ __html: article.article.content }} />
                                                    </SyledCardContent>
                                                    <Author authors={[article.article.author]} created_at={article.article.created_at} />
                                                </SyledCard>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                No articles read yet.
                            </Typography>
                        )}
                    </>
                )}
            </Box>
        </Container>
    );
};

export default EditProfile;
