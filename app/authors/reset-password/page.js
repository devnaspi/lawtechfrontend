'use client';

import React, { useState } from 'react';
import { Box, Button, Typography, Container, TextField } from '@mui/material';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import ReactCodeInput from 'react-code-input';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';



export default function ResetPassword() {
    const [otp, setOtp] = useState('');
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { handleApiError, loading } = useApiErrorHandler();
    const email = sessionStorage.getItem('email')
    const [new_password, setNewPassword] = useState('')
    const [confirm_password, setConfirmPassword] = useState('')

    if (!email) {
        return
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.post('/api/users/auth/reset-password/', {
                email,
                new_password,
                confirm_password
            });

            enqueueSnackbar('Password reset successful. You can now sign in with your new password.', { variant: 'success' });
            router.push('signin');
        } catch (error) {
            handleApiError(error)
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
                    OTP Verification
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        type="email"
                        value={email}
                        disabled
                        required
                        fullWidth
                    />

                    <TextField
                        label="New Password"
                        variant="outlined"
                        type="password"
                        value={new_password}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        value={confirm_password}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                        Verify
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
