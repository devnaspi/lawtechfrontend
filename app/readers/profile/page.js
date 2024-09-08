'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Avatar,
    Button,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Stack,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const regions = ['Africa', 'Asia', 'Europe', 'North America', 'South America'];
const lawAreas = ['Administrative Law', 'Civil Rights Law', 'Criminal Law', 'Family Law', 'Technology Law'];

const EditProfile = () => {
    const [profilePicture, setProfilePicture] = useState('/static/images/avatar/1.jpg'); // Default profile picture
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [region, setRegion] = useState('Africa');
    const [lawArea, setLawArea] = useState('Administrative Law');
    const [experience, setExperience] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [selectedTab, setSelectedTab] = useState(0); // State to track the selected tab
    const [bookmarkedArticles, setBookmarkedArticles] = useState([]); // State to store bookmarked articles

    const router = useRouter();

    useEffect(() => {
        // Load bookmarked articles from local storage when the component mounts
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
        setBookmarkedArticles(bookmarks);
    }, []);

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfilePicture(imageUrl);
        }
    };

    const handleSaveChanges = () => {
        // Logic to save the changes, like an API call
        console.log('Profile updated');
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

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
                    <Tab label="Bookmarked Articles" sx={{ alignItems: 'flex-start' }} />
                    <Tab label="Read Articles" sx={{ alignItems: 'flex-start' }} />
                </Tabs>
            </Box>

            {/* Main Content Area */}
            <Box
                sx={{
                    flexGrow: 1, // Allow main content to grow
                    marginLeft: '250px', // Offset for the fixed side panel
                    paddingTop: 10, // Align with the side panel's top padding
                }}
            >
                {selectedTab === 0 && (
                    <>
                        {/* Edit Profile Content */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Avatar
                                alt={name}
                                src={profilePicture}
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

                        {/* User Information Section */}
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
                        <TextField
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            sx={{ mb: 4 }}
                        />

                        {/* Professional Information Section */}
                        <Typography variant="h6" gutterBottom>
                            Professional Information
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Region</InputLabel>
                            <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                                {regions.map((r) => (
                                    <MenuItem key={r} value={r}>
                                        {r}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Law Area</InputLabel>
                            <Select value={lawArea} onChange={(e) => setLawArea(e.target.value)}>
                                {lawAreas.map((area) => (
                                    <MenuItem key={area} value={area}>
                                        {area}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Experience (Years)"
                            variant="outlined"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            sx={{ mb: 4 }}
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
                            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                                Save Changes
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={() => router.back()}>
                                Cancel
                            </Button>
                        </Stack>
                    </>
                )}

                {selectedTab === 1 && (
                    <>
                        {/* Bookmarked Articles Content */}
                        <Typography variant="h6" gutterBottom>
                            Bookmarked Articles
                        </Typography>
                        {bookmarkedArticles.length > 0 ? (
                            <List>
                                {bookmarkedArticles.map((articleId) => (
                                    <ListItem key={articleId}>
                                        <ListItemText primary={`Article ID: ${articleId}`} />
                                        {/* Add logic here to display more details about the bookmarked article */}
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                No bookmarked articles found.
                            </Typography>
                        )}
                    </>
                )}

                {selectedTab === 2 && (
                    <>
                        {/* Bookmarked Articles Content */}
                        <Typography variant="h6" gutterBottom>
                            Read Articles
                        </Typography>
                        {bookmarkedArticles.length > 0 ? (
                            <List>
                                {bookmarkedArticles.map((articleId) => (
                                    <ListItem key={articleId}>
                                        <ListItemText primary={`Article ID: ${articleId}`} />
                                        {/* Add logic here to display more details about the bookmarked article */}
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                You've not read any articles yet.
                            </Typography>
                        )}
                    </>
                )}
            </Box>
        </Container>
    );
};

export default EditProfile;
