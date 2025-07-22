'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, TextField, Button, Typography, IconButton, InputAdornment, Link } from '@mui/material';
import axiosInstance from '@/lib/axios';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useAuth } from '@/context/AuthContext';
import useApiErrorHandler from '@/utils/useApiErrorHandler';


export default function Signin({ open, handleClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const { handleApiError } = useApiErrorHandler();

    const redirectTo = searchParams.get('redirect') || '/readers';
    useEffect(() => {
        const prefillEmail = sessionStorage.getItem('prefill_email');
        if (prefillEmail) {    
            setUsername(prefillEmail);
            sessionStorage.removeItem('prefill_email');
        }
    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post('/api/users/auth/login/', {
                username,
                password
            });

            const { token } = response.data;
            await login(token, 'client');

            enqueueSnackbar('Login successful!', { variant: 'success' });
            const pendingSubscriptionEmail = sessionStorage.getItem('pending_subscription_email');
            if (pendingSubscriptionEmail) {
                try {
                    await axiosInstance.post('/api/newsletters/subscribe/', {
                        email: pendingSubscriptionEmail,
                    });
                    enqueueSnackbar('You have been subscribed to the newsletter!', { variant: 'success' });
                    sessionStorage.removeItem('pending_subscription_email'); 
                } catch (err) {
                    handleApiError(err);
                }
            }

            handleClose();
            router.push(redirectTo);
        } catch (error) {
            console.log('an error occured', error)
            if (error.response && error.response.data) {
                const errorData = error.response.data;

                if (errorData.detail) {
                    enqueueSnackbar(errorData.detail, { variant: 'error' });
                } else {
                    Object.keys(errorData).forEach((key) => {
                        errorData[key].forEach((message) => {
                            enqueueSnackbar(message, { variant: 'error' });
                        });
                    });
                }
            } else {
                console.log(error)
                enqueueSnackbar('An unexpected error occurred. Please try again.', { variant: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    padding: 2,
                },
            }}

        >
            <DialogTitle
                sx={{
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                Sign In
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mt: 2,
                    }}
                    onSubmit={handleSubmit}
                >
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        edge="end"
                                        aria-label="toggle password visibility"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Link
                            variant="body2"
                            color="primary"
                            align='right'
                            className='pointer'
                            onClick={() => router.push('/readers/forgot-password')}
                        >
                            Forgot Password?
                    </Link>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mt: 2 
                    }}>
                        <Typography variant="body2">
                            Don&apos;t have an account?{' '}
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => router.push('/readers/sign-up')}
                            >
                                Register
                            </Button>
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}