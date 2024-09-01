import * as React from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';  
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { useState } from 'react';
import Search from './Search';

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
                        alignItems: 'center', // Align items vertically in the center
                    }}
                >
                    <Button
                        variant="text"
                        size="small"
                        aria-label="LAWTECH"
                        component="a"
                        href="/"
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                    >
                        LAWTECH
                    </Button>
                    <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                        <Search />
                    </div>
                </Toolbar>
            </Container>
        </StyledAppBar>
        </ThemeProvider>
    );
}

export default NavBar;