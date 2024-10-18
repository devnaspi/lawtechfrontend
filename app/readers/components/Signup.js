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
import axios from '@/lib/axios';
import { useSnackbar } from 'notistack';


export default function Signup({ open, handleClose }) {
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [categories, setCategories] = useState([]);
    const [regions, setRegions] = useState([]);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        region: '',
        country: '',
        areaOfLaw: ''
    });
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {    
            try {
                const response = await axios.get('/api/categories/categories');
                const results = response.data.results;
                setCategories(results);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        
        const fetchRegions = async () => {    
            try {
                const response = await axios.get('/api/categories/regions');
                const results = response.data.results;
                setRegions(results);
            } catch (error) {
                console.error("Error fetching regions:", error);
            }
        };

        fetchCategories();
        fetchRegions();
    }, []);

    const handlePasswordVisibilityToggle = () => {
        setPasswordVisible((prevVisible) => !prevVisible);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/users/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                region: formData.region,
                country: formData.country,
                area_of_law: formData.areaOfLaw,
                role: 'client',
            });

            if (response.status === 201) {
                enqueueSnackbar(response.data.message, { variant: 'success' });

                handleClose();
                router.push('/readers/login');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;

                Object.keys(errorData).forEach((key) => {
                    errorData[key].forEach((message) => {
                        enqueueSnackbar(message, { variant: 'error' });
                    });
                });
            } else {
                enqueueSnackbar('An unexpected error occurred. Please try again.', { variant: 'error' });
            }
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
                    onSubmit={handleSubmit}
                >
                    <TextField
                        label="Username"
                        variant="outlined"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    />


                    {/* Email Field */}
                    <TextField
                        label="Email"
                        variant="outlined"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        type="email"
                        required
                        fullWidth
                    />

                    {/* Password Field */}
                    <TextField
                        label="Password"
                        variant="outlined"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
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

                    <TextField
                        select
                        label="Region"
                        name="region"
                        value={selectedRegion}
                        onChange={(e) => {
                            setSelectedRegion(e.target.value);
                            handleInputChange(e);
                        }}
                        variant="outlined"
                        required
                        fullWidth
                    >
                        {regions.map((region) => (
                            <MenuItem key={region.id} value={region.name}>
                                {region.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Area of Law"
                        name="areaOfLaw"
                        value={formData.areaOfLaw}
                        onChange={handleInputChange}
                        variant="outlined"
                        required
                        fullWidth
                    >
                        {categories.map((area) => (
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
                                router.push('/readers/login');
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
