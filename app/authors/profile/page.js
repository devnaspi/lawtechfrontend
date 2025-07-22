'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Avatar, Typography, IconButton, Autocomplete, Chip } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from 'notistack';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@emotion/react';

const ManageProfile = () => {
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [specialties, setSpecialties] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState('/static/images/avatar/1.jpg');

    const [existingTags, setExistingTags] = useState([]);
    const { handleApiError } = useApiErrorHandler();
    const { enqueueSnackbar } = useSnackbar();
    const { auth, setAuth, loading } = useAuth();
    const theme = useTheme();

    useEffect(() => {
        if (!loading) {
            const user = auth.user?.user || auth.user;
            setName(user?.username || '');
            setEmail(user?.email || '');
            setFirstName(user?.first_name || '');
            setLastName(user?.last_name || '');
            setProfilePicturePreview(user?.profile_picture || '/static/images/avatar/1.jpg');
            setSpecialties(auth.user?.tags || []);
        }

        const fetchProfileDetails = async () => {
            try {
                const tagsResponse = await axiosInstance.get('/api/tags/');
                setExistingTags(tagsResponse.data.results.map(tag => tag.name));
            } catch (error) {
                handleApiError(error);
            }
        };

        fetchProfileDetails();
    }, [loading]);

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePicturePreview(URL.createObjectURL(file));
            setProfilePicture(file);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const formData = new FormData();
            formData.append('username', name);
            formData.append('email', email);
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            formData.append('tags', specialties);

            if (profilePicture instanceof File) {
                formData.append('profile_picture', profilePicture);
            }

            await axiosInstance.put('/api/authors/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const response = await axiosInstance.get('/api/authors/profile/');
            const updatedUser = response.data;

            setAuth((prevAuth) => ({
                ...prevAuth,
                user: updatedUser,
            }));

            enqueueSnackbar('Profile updated successfully', { variant: 'success' });

        } catch (error) {
            handleApiError(error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Manage Profile
            </Typography>

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

            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={textFieldStyle(theme)}
            />

            <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={textFieldStyle(theme)}
            />

            <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={textFieldStyle(theme)}
            />

            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={textFieldStyle(theme)}
            />

            <Autocomplete
                multiple
                freeSolo
                options={existingTags}
                value={specialties}
                onChange={(event, newValue) => setSpecialties(newValue)}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            key={option}
                        />
                    ))
                }
                renderInput={(params) => <TextField {...params} label="Specialties" variant="outlined" />}
                sx={textFieldStyle(theme)}
            />

            <Button variant="contained" color="primary" onClick={handleSaveProfile}>
                Save Profile
            </Button>
        </Container>
    );
};

const textFieldStyle = (theme) => ({
    mb: 3,
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
    '& input': {
        color: theme.palette.text.primary,
    },
});

export default ManageProfile;
