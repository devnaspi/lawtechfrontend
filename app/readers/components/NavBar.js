import * as React from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';  
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Search from './Search';
import { useRouter } from 'next/navigation';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderBottom: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    backgroundImage: 'none',
    padding: 4,
}));

function NavBar() {
    const [mode] = useState('light');
    const defaultTheme = createTheme({ palette: { mode } });
    const router = useRouter()
    const { auth } = useAuth();

    return (
        <ThemeProvider theme={defaultTheme}>
            <StyledAppBar>
                <Container maxWidth="lg">
                    <Toolbar
                        variant="dense"
                        disableGutters
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Button
                            variant="text"
                            size="small"
                            aria-label="LAWTECH"
                            component="a"
                            href="/readers/"
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                        >
                            LAWTECH
                        </Button>

                        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                            <Search />
                        </div>

                        {/* Conditionally render user information if authenticated */}
                        {auth.isAuthenticated && (
                            <Stack onClick={() => {
                                router.push('/readers/profile');
                            }} direction="row" alignItems="center" spacing={1} className='pointer'>
                                <Avatar
                                    alt={auth.user?.username}
                                    src={auth.user?.profile_picture || '/static/images/avatar/1.jpg'}
                                    sx={{ width: 32, height: 32 }}
                                />
                                <Typography color='black' variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {auth.user?.username}
                                </Typography>
                            </Stack>
                        )}
                    </Toolbar>
                </Container>
            </StyledAppBar>
        </ThemeProvider>
    );
}

export default NavBar;
