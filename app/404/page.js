'use client'

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Dialog, DialogContent } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useRouter } from 'next/navigation';

const Custom404 = () => {
const router = useRouter();
const [openDialog, setOpenDialog] = useState(true); // Initialize dialog open state

const handleCloseDialog = () => {
setOpenDialog(false);
router.push('/'); // Navigate back to the home page
};

useEffect(() => {
setOpenDialog(true); // Open the dialog when the component mounts
}, []);

return (
<Container
    maxWidth="md"
    sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    }}
>
    <Dialog
    open={openDialog}
    onClose={handleCloseDialog}
    maxWidth="sm" // Adjust the maximum width of the dialog
    fullWidth
    PaperProps={{
        sx: {
        padding: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        },
    }}
    >
    <DialogContent>
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: 4,
        }}
        >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'red', mb: 3 }} />
        <Typography variant="h4" gutterBottom>
            404 - Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
            Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleCloseDialog}>
            Back to Home
        </Button>
        </Box>
    </DialogContent>
    </Dialog>
</Container>
);
};

export default Custom404;
