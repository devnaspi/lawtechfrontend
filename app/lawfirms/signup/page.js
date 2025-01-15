'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, Autocomplete, Chip, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { useSnackbar } from 'notistack';
import useApiErrorHandler from '@/utils/useApiErrorHandler';


export default function LawfirmSignup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [tags, setTags] = useState([]);
    const [country, setCountry] = useState('Nigeria');
    const [existingTags, setExistingTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { handleApiError } = useApiErrorHandler()

    const [selectedRegion, setSelectedRegion] = useState('Africa');
    const [regions, setRegions] = useState([]);
    const [countries, setCountries] = useState([]);


    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axiosInstance.get('/api/tags/');
                setExistingTags(response.data.results.map(tag => tag.name));
            } catch (error) {
                handleApiError(error)
            }
        };

        const fetchRegions = async () => {
            const response = await axiosInstance.get('/api/categories/regions');
            setRegions(response.data.results);
        };

        fetchTags();
        fetchRegions();
    }, []);

    useEffect(() => {
        fetchCountries()
    }, [selectedRegion])

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const registrationResponse = await axiosInstance.post('/api/lawfirms/register/new/', {
                username,
                password,
                email,
                name,
                tags,
                country,
                website
            });

            enqueueSnackbar('Registration successful!', { variant: 'success' });

            router.push('/lawfirms/signin');
        } catch (error) {
            handleApiError(error)
        } finally {
            setLoading(false);
        }
    };

    const fetchCountries = async () => {
        const response = await axiosInstance.get(`/api/categories/regions/${selectedRegion}/countries`);
        setCountries(response.data);
    }

    const handleRegionInputChange = (e) => {
        setSelectedRegion(e.target.value)
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                    gap: 2,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Lawfirm Signup
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Lawfirm Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                    />

                    <TextField
                        margin="normal"
                        select
                        label="Region"
                        name="region"
                        value={selectedRegion}
                        onChange={handleRegionInputChange}
                        required
                        fullWidth
                    >
                        {regions.map((region) => (
                            <MenuItem key={region.id} value={region.name}>{region.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="normal"
                        select
                        label="Country"
                        name="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        fullWidth
                    >
                        {countries.map((country) => (
                            <MenuItem key={country.id} value={country.name}>{country.name}</MenuItem>
                        ))}
                    </TextField>

                    {/* Tags Input */}
                    <Autocomplete
                        multiple
                        freeSolo
                        options={existingTags}
                        value={tags}
                        onChange={(event, newValue) => setTags(newValue)}
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
                        renderInput={(params) => <TextField {...params} label="Specialties (Tags)" variant="outlined" />}
                        sx={{ mt: 4, mb: 4 }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </Button>
                </Box>

                <Typography variant="body2">
                    Already have an account?{' '}
                    <Button variant="text" onClick={() => router.push('/lawfirms/signin')}>
                        Log In
                    </Button>
                </Typography>
            </Box>
        </Container>
    );
}
