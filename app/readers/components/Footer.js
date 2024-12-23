import * as React from 'react';
import { useState } from 'react';
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
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';


function Copyright() {
    return (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            {'Copyright © '}
            <Link color="text.secondary" href="/">
                LAWTECH
            </Link>
            &nbsp;
            {new Date().getFullYear()}
        </Typography>
    );
}

export default function Footer() {
    const { auth } = useAuth();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { handleApiError } = useApiErrorHandler();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();




    const handleSubscribe = async () => {
        if (!email) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await axiosInstance.post('/api/newsletters/subscribe/', {
                email
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Subscribed successfully!' });
                setEmail('');
            } else {
                setMessage({ type: 'error', text: data.message || 'Subscription failed.' });
            }
        } catch (error) {
            if (error.response?.status === 401) {
                sessionStorage.setItem('prefill_email', email);
                sessionStorage.setItem('pending_subscription_email', email);
                enqueueSnackbar('Please sign in to subscribe!', { variant: 'error' });

                router.push('/readers/login');
            } else {
                handleApiError(error);
            }    
        } finally {
            setLoading(false);
        }
    };

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
                <div>
                    <Link display={'none'} color="text.secondary" variant="body2" href="/readers/#">
                        Privacy Policy
                    </Link>
                    {/* <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
                        &nbsp;•&nbsp;
                    </Typography> */}
                    <Link  display={'none'} color="text.secondary" variant="body2" href="/readers/#">
                        Terms of Service
                    </Link>
                    <Copyright />
                </div>
                <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ justifyContent: 'left', color: 'text.secondary', display: 'none' }}
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

                {/* Show Newsletter Subscription only if user is not authenticated */}
                {!auth.isAuthenticated && (
                    <Box>
                        <Typography
                            variant="body2"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                        >
                            Join the newsletter
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            Subscribe for weekly updates. We won`&apos;`t spam you.
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                InputProps={{
                                    sx: {
                                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                                        borderRadius: 1,
                                        color: 'text.primary',
                                        border: '1px solid',
                                        borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
                                        '&:hover': {
                                            borderColor: (theme) => theme.palette.primary.main,
                                        },
                                        '&.Mui-focused': {
                                            borderColor: (theme) => theme.palette.primary.main,
                                            boxShadow: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? `0 0 0 2px ${theme.palette.primary.main}`
                                                    : 'none',
                                        },
                                    },
                                }}
                                InputLabelProps={{
                                    sx: {
                                        color: 'text.secondary',
                                    },
                                }}
                                slotProps={{
                                    htmlInput: {
                                        autoComplete: 'off',
                                        'aria-label': 'Enter your email address',
                                        style: { color: 'inherit' },
                                    },
                                }}
                                sx={{
                                    width: '250px',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: (theme) => theme.palette.primary.main,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: (theme) => theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={handleSubscribe}
                                disabled={loading}
                                sx={{ flexShrink: 0 }}
                            >                                
                                {loading ? <span className='text-white'>`&apos;`Subscribing...`&apos;`</span> : <span>`&apos;`Subscribe`&apos;`</span>}
                            </Button>
                        </Stack>
                        {message && (
                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 2,
                                    color: message.type === 'success' ? 'green' : 'red',
                                }}
                            >
                                {message.text}
                            </Typography>
                        )}
                    </Box>
                )}
            </Container>
        </React.Fragment>
    );
}
