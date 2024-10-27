'use client';

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, TextField, Button, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';

export default function EmailCollection({ open, handleClose, onOTPSuccess }) {
    const [email, setEmail] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const { handleApiError } = useApiErrorHandler();

    const handleEmailSubmit = async () => {
        if (!email) {
            enqueueSnackbar('Email is required.', { variant: 'error' });
            return;
        }

        try {
            const response = await axios.post('/api/users/auth/send-otp/', { email });
            if (response.status === 200) {
                enqueueSnackbar('OTP sent to your email!', { variant: 'success' });
                onOTPSuccess(email);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    // Regex to validate email format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Enter Your Email</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        type="email"
                    />
                    <Button
                        variant="contained"
                        onClick={handleEmailSubmit}
                        disabled={!isValidEmail(email)}
                    >
                        Sign up
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
