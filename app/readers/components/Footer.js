import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import FacebookIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';

function Copyright() {
    return (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
        {'Copyright © '}
        <Link color="text.secondary" href="/readers/https://mui.com/">
            LAWTECH
        </Link>
        &nbsp;
        {new Date().getFullYear()}
        </Typography>
    );
    }

    export default function Footer() {
    return (
        <React.Fragment>
        <Divider />
        <Container
            sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'start',
            pb: { xs: 8, sm: 10 },
            pt: { xs: 4, sm: 6 },
            textAlign: { sm: 'center', md: 'left' },
            }}
        >
                <div >
                    <Link color="text.secondary" variant="body2" href="/readers/#">
                    Privacy Policy
                    </Link>
                    <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
                    &nbsp;•&nbsp;
                    </Typography>
                    <Link color="text.secondary" variant="body2" href="/readers/#">
                    Terms of Service
                    </Link> 
                    <Copyright />
                </div>
                <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ justifyContent: 'left', color: 'text.secondary'}}
                >
                    <IconButton
                    color="inherit"
                    size="small"
                    href="/readers/https://github.com/mui"
                    aria-label="GitHub"
                    sx={{ alignSelf: 'center' }}
                    >
                    <FacebookIcon />
                    </IconButton>
                    <IconButton
                    color="inherit"
                    size="small"
                    href="/readers/https://x.com/MaterialUI"
                    aria-label="X"
                    sx={{ alignSelf: 'center' }}
                    >
                    <TwitterIcon />
                    </IconButton>
                    <IconButton
                    color="inherit"
                    size="small"
                    href="/readers/https://www.linkedin.com/company/mui/"
                    aria-label="LinkedIn"
                    sx={{ alignSelf: 'center' }}
                    >
                    <LinkedInIcon />
                    </IconButton>
                </Stack>
                <Box>
                    <Typography
                        variant="body2"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                    >
                        Join the newsletter
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        Subscribe for weekly updates. We won't spam you.
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap>
                        <InputLabel htmlFor="email-newsletter" sx={visuallyHidden}>
                        Email
                        </InputLabel>
                        <TextField
                        id="email-newsletter"
                        hiddenLabel
                        size="small"
                        variant="outlined"
                        fullWidth
                        aria-label="Enter your email address"
                        placeholder="Your email address"
                        slotProps={{
                            htmlInput: {
                            autoComplete: 'off',
                            'aria-label': 'Enter your email address',
                            },
                        }}
                        sx={{ width: '250px' }}
                        />
                        <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ flexShrink: 0 }}
                        >
                        Subscribe
                        </Button>
                    </Stack>
                </Box>
        </Container>
        </React.Fragment>
    );
}