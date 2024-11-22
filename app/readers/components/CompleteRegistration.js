'use client';

import useApiErrorHandler from '@/utils/useApiErrorHandler';
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    TextField,
    Button,
    MenuItem,
    InputAdornment,
    IconButton as MuiIconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';


export default function CompleteRegistration({ open, handleClose, email }) {
    const [categories, setCategories] = useState([]);
    const [regions, setRegions] = useState([]);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { handleApiError } = useApiErrorHandler();
    const router = useRouter();


    const [formData, setFormData] = useState({
        username: '',
        password: '',
        region: '',
        areaOfLaw: ''
    });

    const isFormValid = Object.values(formData).every((value) => value.trim() !== '');

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axios.get('/api/categories/categories');
            setCategories(response.data.results);
        };

        const fetchRegions = async () => {
            const response = await axios.get('/api/categories/regions');
            setRegions(response.data.results);
        };

        fetchCategories();
        fetchRegions();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/users/register/', {
                ...formData,
                email,
                role: 'client',
            });
            enqueueSnackbar(response.data.message, { variant: 'success' });
            handleClose();
            router.push('/readers/login');
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Complete Registration</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    <TextField label="Email" value={email} disabled fullWidth />
                    <TextField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        type={passwordVisible ? 'text' : 'password'}
                        required
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <MuiIconButton onClick={() => setPasswordVisible(!passwordVisible)} edge="end">
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
                        value={formData.region}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    >
                        {regions.map((region) => (
                            <MenuItem key={region.id} value={region.name}>{region.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Area of Law"
                        name="areaOfLaw"
                        value={formData.areaOfLaw}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
                        ))}
                    </TextField>
                    <Button variant="contained" onClick={handleSubmit} disabled={!isFormValid}>Register</Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
