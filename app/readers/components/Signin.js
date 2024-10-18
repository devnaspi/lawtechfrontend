'use client';

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useAuth } from '@/context/AuthContext';


export default function Signin({ open, handleClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    const redirectTo = searchParams.get('redirect') || '/readers';

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post('/api/users/auth/login', {
                username,
                password
            });

            const { token } = response.data;
            await login(token, 'client');

            enqueueSnackbar('Login successful!', { variant: 'success' });
            handleClose();

            router.push(redirectTo);
        } catch (error) {
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
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                        Don't have an account?{' '}
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => router.push('/readers/sign-up')}
                        >
                            Register
                        </Button>
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
