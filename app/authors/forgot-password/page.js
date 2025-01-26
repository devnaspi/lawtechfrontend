'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, Link } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import { useAuth } from '@/context/AuthContext';
import { useSnackbar } from 'notistack';


export default function AuthorForgotPassword() {
    const [email, setEmail] = useState('');
    const router = useRouter();
    const { handleApiError, loading } = useApiErrorHandler();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.post('/api/users/auth/forgot-password/', {
                email
            });
            if (response.status === 200) {
                sessionStorage.setItem('email', email)
                router.push('verify-otp');
            }
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
                    Forgot Password
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Enter the email address associated with your account, 
                    and we&apos;ll send you an OTP to reset your password.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {loading ? 'Signing In...' : 'send otp'}
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
