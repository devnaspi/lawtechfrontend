'use client';

import React, { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    Box, 
    TextField, 
    Button, 
    Typography, 
    IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';

export default function ForgotPassword({ open, handleClose, onOTPSuccess }) {
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
                onOTPSuccess(email);
            }
        } catch (error) {
            handleApiError(error)
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
                Forgot Password
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
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Enter the email address associated with your account, 
                        and we&apos;ll send you an otp to reset your password.
                    </Typography>

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
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Sending Reset Link...' : 'Reset Password'}
                    </Button>

                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                        Remember your password?{' '}
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => router.push('/readers/login')}
                        >
                            Sign In
                        </Button>
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}