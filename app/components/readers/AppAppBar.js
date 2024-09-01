'use client'

import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useRouter } from 'next/navigation';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
        backdropFilter: 'blur(24px)',
        border: '1px solid',
        borderColor: theme.palette.divider,
        backgroundColor: alpha(theme.palette.background.default, 0.4),
        boxShadow: theme.shadows[1],
        padding: '8px 12px',
    }));

    export default function AppAppBar() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter()

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
    <AppBar
        position="fixed"
        sx={{ boxShadow: 0, bgcolor: 'transparent', backgroundImage: 'none', mt: 10 }}
    >
        <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>            
                <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                    Explore
                </Button>
                <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                    Authors
                </Button>
                <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                    Law Firms
                </Button>
            </Box>
            </Box>
            <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 1,
                alignItems: 'center',
            }}
            >
            <Button color="primary" variant="text" size="small" onClick={() => router.push('/login')}>
                Sign in
            </Button>
            <Button color="primary" variant="contained" size="small" onClick={() => router.push('/sign-up')}>
                Sign up
            </Button>
            </Box>
            <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
            </Box>
        </StyledToolbar>
        </Container>
    </AppBar>
    );
}