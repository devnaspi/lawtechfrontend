'use client';

import { Box, Typography, Button, Stack, useTheme } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box
        sx={{
            minHeight: '85vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'start',
            backgroundImage: 'url("/law404.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: 4,
        }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center" >
        <SentimentVeryDissatisfiedIcon sx={{ fontSize: 80, color: '#ee8822' }} />
        <Typography variant="h4" color="text.primary">
          404 - Page Not Found
        </Typography>
        <Typography variant="h6" sx={{fontWeight: 'bold'}} color="text.primary" maxWidth={500}>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back on track.
        </Typography>
        <Button sx={{'backgroundColor': '#ee8822'}} variant="contained" color="primary" onClick={() => router.push('/')}>
          Go to Homepage
        </Button>
      </Stack>
    </Box>
  );
}
