'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, Link } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import { useAuth } from '@/context/AuthContext';
import { useSnackbar } from 'notistack';


export default function AuthorLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, auth, setAuth } = useAuth();
    const { handleApiError } = useApiErrorHandler();
    const { enqueueSnackbar } = useSnackbar();

    const redirectTo = searchParams.get('redirect') || '/authors/dashboard';

    useEffect(() => {
        if (auth.error) {
            handleApiError(auth.error);

            setAuth(prevAuth => ({
                ...prevAuth,
                error: null
            }));
        } else {
            if (auth.isAuthenticated) {
                router.push(redirectTo);
            }
        }
    }, [auth.error, handleApiError, auth.isAuthenticated]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post('/api/users/auth/login/', {
                username,
                password,
            });

            const { token } = response.data;
            await login(token, 'author');
            
            router.push(redirectTo);
        } catch (error) {
            handleApiError(error)
        } finally {
            setLoading(false);
        }
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
                    Login
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
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Link
                            variant="body2"
                            color="primary"
                            align='right'
                            className='pointer'
                            onClick={() => router.push('/authors/forgot-password')}
                        >
                            Forgot Password?
                    </Link>

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
                </Box>
            </Box>
        </Container>
    );
}
