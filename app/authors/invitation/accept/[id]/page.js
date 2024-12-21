'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, Autocomplete } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSnackbar } from 'notistack';


export default function AuthorAcceptInviation() {
    const { enqueueSnackbar } = useSnackbar();
    const [email, setEmail] = useState('');
    const router = useRouter();
    const [specialties, setSpecialties] = useState([]);
    const { handleApiError, loading } = useApiErrorHandler();
    const { id } = useParams();
    const [authorData, setAuthorData] = useState({
        email: '',
        invitation_code: id,
        username: '',
        password: '',
        tags: ''
    });

    useEffect(() => {
        fetchInvitationDetails()
        fetchTags();
    }, [])

    const fetchTags = async () => {
        try {
            const response = await axiosInstance.get('/api/tags/');
            setSpecialties(response.data.results.map(tag => tag.name));
        } catch (error) {         
            handleApiError(error);
        } 
    };

    const fetchInvitationDetails = async (event) => {
        try {
            const response = await axiosInstance.get(`/api/lawfirms/authors/verify-invitation/${id}`);
            if (response.status === 200) {
                setAuthorData(response.data)
            }
        } catch (error) {
            handleApiError(error)
        } 
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.post('/api/lawfirms/authors/complete-registration/', {
                ...authorData
            });
            enqueueSnackbar('Your Registration was Successful, Please Sign in!', { variant: 'success' });
            router.push('/authors/signin');
        } catch (error) {
            handleApiError(error)
        } 
    };

    return (
        <Container maxWidth="sm" >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                    gap: 2,
                }}
            >
                <Typography variant="h4"  gutterBottom>
                    Complete Your Registration
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Please complete your registration by providing the required information.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        type="email"
                        value={authorData.email}
                        required
                        fullWidth
                        disabled
                    />

                <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={authorData.username}
                        onChange={(e) => setAuthorData({ ...authorData, username: e.target.value })}
                        sx={{ mb: 3 }}
                    />

                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    value={authorData.password}
                    onChange={(e) => setAuthorData({ ...authorData, password: e.target.value })}
                    sx={{ mb: 3 }}
                />

                <Autocomplete
                    multiple
                    freeSolo
                    options={specialties}
                    value={authorData.specialties}
                    onChange={(event, newValue) => setAuthorData({ ...authorData, specialties: newValue })}
                    renderInput={(params) => <TextField {...params} label="Specialties" variant="outlined" />}
                    sx={{ mb: 3 }}
                />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                        Remember your password?{' '}
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => router.push('/authors/signin')}
                        >
                            Sign In
                        </Button>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
