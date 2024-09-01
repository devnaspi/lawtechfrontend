// Signup.js
'use client'

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    MenuItem,
    InputAdornment,
    IconButton as MuiIconButton,
    } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';

    // Example regions and countries data (you can replace with your actual data or API call)
const regions = [
    { value: 'Africa', label: 'Africa' },
    { value: 'Asia', label: 'Asia' },
    { value: 'Europe', label: 'Europe' },
    { value: 'North America', label: 'North America' },
    { value: 'South America', label: 'South America' },
    { value: 'Australia', label: 'Australia' },
];

const countries = {
    Africa: ['Nigeria', 'Kenya', 'South Africa'],
    Asia: ['China', 'India', 'Japan'],
    Europe: ['Germany', 'France', 'United Kingdom'],
    'North America': ['United States', 'Canada', 'Mexico'],
    'South America': ['Brazil', 'Argentina', 'Chile'],
    Australia: ['Australia'],
};

export default function Signup({ open, handleClose }) {
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [areasOfLaw, setAreasOfLaw] = useState([]);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const router = useRouter()

    useEffect(() => {
    // Fetch the areas of law from the backend (replace the URL with your backend API endpoint)
    fetch('https://your-backend-api.com/areas-of-law')
        .then((response) => response.json())
        .then((data) => setAreasOfLaw(data))
        .catch((error) => console.error('Error fetching areas of law:', error));
    }, []);

    const handlePasswordVisibilityToggle = () => {
        setPasswordVisible((prevVisible) => !prevVisible);
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
        Sign Up
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
        >
            {/* First Name Field */}
            <TextField label="First Name" variant="outlined" required fullWidth />

            {/* Last Name Field */}
            <TextField label="Last Name" variant="outlined" required fullWidth />

            {/* Email Field */}
            <TextField label="Email" variant="outlined" type="email" required fullWidth />

            {/* Password Field with Visibility Toggle */}
            <TextField
            label="Password"
            variant="outlined"
            type={passwordVisible ? 'text' : 'password'}
            required
            fullWidth
            InputProps={{
                endAdornment: (
                <InputAdornment position="end">
                    <MuiIconButton onClick={handlePasswordVisibilityToggle} edge="end">
                    {passwordVisible ? <VisibilityOff /> : <Visibility />}
                    </MuiIconButton>
                </InputAdornment>
                ),
            }}
            />

            {/* Region Dropdown */}
            <TextField
            select
            label="Region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            variant="outlined"
            required
            fullWidth
            >
            {regions.map((region) => (
                <MenuItem key={region.value} value={region.value}>
                {region.label}
                </MenuItem>
            ))}
            </TextField>

            {/* Country Dropdown */}
            <TextField
            select
            label="Country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            variant="outlined"
            required
            fullWidth
            disabled={!selectedRegion}
            >
            {selectedRegion &&
                countries[selectedRegion].map((country) => (
                <MenuItem key={country} value={country}>
                    {country}
                </MenuItem>
                ))}
            </TextField>

            {/* Area of Law Dropdown */}
            <TextField
            select
            label="Area of Law"
            variant="outlined"
            required
            fullWidth
            >
            {areasOfLaw.map((area) => (
                <MenuItem key={area.id} value={area.name}>
                {area.name}
                </MenuItem>
            ))}
            </TextField>

            {/* Sign Up Button */}
            <Button variant="contained" color="primary" sx={{ mt: 2 }} type="submit">
            Sign Up
            </Button>

            {/* Login Option */}
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
            Already have an account?{' '}
            <Button
                variant="text"
                color="primary"
                onClick={() => {
                    router.push('/login')
                }}
            >
                Login
            </Button>
            </Typography>
        </Box>
        </DialogContent>
    </Dialog>
    );
}
