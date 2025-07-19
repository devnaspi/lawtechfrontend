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
    Select,
    OutlinedInput,
    Checkbox,
    ListItemText,
    FormControl,
    InputLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function CompleteRegistration({ open, handleClose, email }) {
    const [tags, setTags] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('Africa');
    const [regions, setRegions] = useState([]);
    const [countries, setCountries] = useState([]);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { handleApiError } = useApiErrorHandler();
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        country: '',
        preferred_tags: [],
    });

    const isFormValid =
        formData.username.trim() !== '' &&
        formData.password.trim() !== '' &&
        formData.country.trim() !== '' &&
        formData.preferred_tags.length > 0;

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axiosInstance.get('/api/tags/');
                setTags(response.data.results);
            } catch (error) {
                handleApiError(error);
            }
        };

        const fetchRegions = async () => {
            try {
                const response = await axiosInstance.get('/api/categories/regions');
                setRegions(response.data.results);
            } catch (error) {
                handleApiError(error);
            }
        };

        fetchTags();
        fetchRegions();
    }, []);

    useEffect(() => {
        fetchCountries();
    }, [selectedRegion]);

    const fetchCountries = async () => {
        try {
            const response = await axiosInstance.get(`/api/categories/regions/${selectedRegion}/countries`);
            setCountries(response.data);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleRegionInputChange = (e) => {
        setSelectedRegion(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (event) => {
        const {
            target: { value },
        } = event;
        setFormData((prev) => ({
            ...prev,
            preferred_tags: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                email,
                role: 'client',
            };
            const response = await axiosInstance.post('/api/users/register/', payload);
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
                        value={selectedRegion}
                        onChange={handleRegionInputChange}
                        required
                        fullWidth
                    >
                        {regions.map((region) => (
                            <MenuItem key={region.id} value={region.name}>{region.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    >
                        {countries.map((country) => (
                            <MenuItem key={country.id} value={country.name}>{country.name}</MenuItem>
                        ))}
                    </TextField>

                    <FormControl fullWidth>
                        <InputLabel id="preferred-tags-label">Area of Law</InputLabel>
                        <Select
                            multiple
                            displayEmpty
                            value={formData.preferred_tags}
                            onChange={handleTagsChange}
                            renderValue={(selected) => {
                                if (selected.length === 0) {
                                    return <span>Area of Law Your&apos;e interested in</span>;
                                }
                                return selected.join(', ');
                            }}
                            fullWidth
                        >
                            {tags.map((tag, index) => (
                                <MenuItem key={index} value={tag.name}>
                                    <Checkbox checked={formData.preferred_tags.indexOf(tag.name) > -1} />
                                    <ListItemText primary={tag.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <Button variant="contained" onClick={handleSubmit} disabled={!isFormValid}>Register</Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
