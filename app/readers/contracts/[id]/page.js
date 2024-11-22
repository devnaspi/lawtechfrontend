'use client';

import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import axiosInstance from '@/lib/axios';
import { useTheme } from '@emotion/react';
import useApiErrorHandler from '@/utils/useApiErrorHandler';

const ContractDetail = ({ params }) => {
    const [contract, setContract] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const contractId = params.id;
    const theme = useTheme()
    const { handleApiError } = useApiErrorHandler();


    useEffect(() => {
        const fetchContractDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/contracts/${contractId}`);
                const data = response.data;
                setContract(data);

                const initialFormData = {};
                data.fields.forEach(field => {
                    initialFormData[field.field_name] = '';
                });
                setFormData(initialFormData);
            } catch (err) {
                setError('Error fetching contract details');
                console.error('Error fetching contract details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchContractDetails();
    }, [contractId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        const isFormValid = Object.keys(formData).every(key => formData[key].trim() !== '');

        if (!isFormValid) {
            setValidationError('Please fill in all required fields before generating the preview.');
            return;
        }

        setValidationError(null);

        try {
            const response = await axiosInstance.post(`/api/contracts/${contractId}/generate`, {
                field_values: formData
            });

            console.log('response', response)
            setDownloadUrl(response.data.download_url);
            setPreviewUrl(response.data.preview_url);
        } catch (err) {
            // handleApiError(err);
            console.log('id is ', contractId)

            console.error('Error generating contract:', err);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography variant="h6" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 20, mb: 4, minHeight: '80vh' }}>
            <Grid container spacing={4}>
                {/* Form Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom>
                        Fill Contract Details
                    </Typography>
                    {validationError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {validationError}
                        </Alert>
                    )}
                    <Box component="form">
                        {contract?.fields.map((field) => (
                            <TextField
                                key={field.field_name}
                                label={field.field_name.replace('_', ' ')}
                                name={field.field_name}
                                type={field.field_type}
                                fullWidth
                                margin="normal"
                                required
                                value={formData[field.field_name] || ''}
                                onChange={handleInputChange}
                                sx={{ '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: theme.palette.primary.main,
                                    },
                                    '&:hover fieldset': {
                                      borderColor: theme.palette.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: theme.palette.primary.main,
                                    },
                                  },
                                  '& input': {
                                    color: theme.palette.text.primary,
                                }, }}
                            />
                        ))}
                        <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
                            Generate Contract
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom>
                        Contract Preview
                    </Typography>
                    {previewUrl ? (
                        <Box
                            component="iframe"
                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                            sx={{
                                width: '100%',
                                height: '500px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            Fill the form and click "Save" to see a preview.
                        </Typography>
                    )}
                    {downloadUrl && (
                        <Button variant="outlined" sx={{ mt: 2 }} href={downloadUrl} download>
                            Download Contract
                        </Button>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ContractDetail;
