'use client';

import React, { useState } from 'react';
import { Container, Box, TextField, Button, Avatar, Typography, IconButton, Autocomplete, Chip } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const ManageProfile = () => {
    const [profile, setProfile] = useState({
        name: 'John Doe',
        bio: 'Experienced legal writer.',
        email: 'john.doe@example.com',
        profilePicture: '/static/images/avatar/1.jpg', // Example image
        specialties: [], // State to store selected tags
    });

    // Example tags that an author might specialize in
    const tags = ['Criminal Law', 'Civil Rights', 'Corporate Law', 'Intellectual Property', 'Family Law'];

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfile({ ...profile, profilePicture: imageUrl });
        }
    };

    const handleSaveProfile = () => {
        // Logic to save the profile changes, e.g., API call
        console.log('Profile saved', profile);

        // Example: Make an API call to update the profile
        // fetch('/api/updateProfile', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(profile)
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('Profile updated:', data);
        // })
        // .catch(error => {
        //     console.error('Error updating profile:', error);
        // });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Title */}
            <Typography variant="h4" gutterBottom>
                Manage Profile
            </Typography>

            {/* Profile Picture Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar
                    alt={profile.name}
                    src={profile.profilePicture}
                    sx={{ width: 100, height: 100, mx: 'auto' }}
                />
                <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    sx={{ mt: 1 }}
                >
                    <input hidden accept="image/*" type="file" onChange={handleProfilePictureChange} />
                    <PhotoCamera />
                </IconButton>
            </Box>

            {/* Profile Form */}
            <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                sx={{ mb: 3 }}
            />

            <TextField
                label="Bio"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                sx={{ mb: 3 }}
            />

            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                sx={{ mb: 3 }}
            />

            {/* Tags Input with Autocomplete for Multi-select */}
            <Autocomplete
                multiple
                freeSolo
                options={tags} // Options for selection
                value={profile.specialties}
                onChange={(event, newValue) => setProfile({ ...profile, specialties: newValue })}
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
                sx={{ mt: 4, mb: 4 }}
            />

            {/* Save Button */}
            <Button variant="contained" color="primary" onClick={handleSaveProfile}>
                Save Profile
            </Button>
        </Container>
    );
};

export default ManageProfile;
