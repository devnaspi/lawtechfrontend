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
    const contractCode = params.code;
    const theme = useTheme()
    const { handleApiError } = useApiErrorHandler();


    useEffect(() => {
        const fetchContractDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/contracts/${contractCode}`);
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
    }, [contractCode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        const isFormValid = Object.keys(formData).every((key) => {
            const value = formData[key];
            if (Array.isArray(value)) {
              return value.every((item) => item.trim() !== '');
            }
            return typeof value === 'string' && value.trim() !== '';
        });          

        if (!isFormValid) {
            setValidationError('Please fill in all required fields before generating the preview.');
            return;
        }

        setValidationError(null);

        try {
            const response = await axiosInstance.post(`/api/contracts/${contractCode}/generate`, {
                field_values: formData
            });

            console.log('response', response)
            setDownloadUrl(response.data.download_url);
            setPreviewUrl(response.data.preview_url);
        } catch (err) {
            // handleApiError(err);
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
                        <Box key={field.field_name} sx={{ mb: 2 }}>
                            {field.field_type === 'list' ? (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                {field.field_name.replace('_', ' ')} (List)
                                </Typography>
                                {(formData[field.field_name] || ['']).map((item, index) => (
                                <TextField
                                    key={index}
                                    label={`Item ${index + 1}`}
                                    fullWidth
                                    margin="dense"
                                    value={item}
                                    onChange={(e) => {
                                    const newList = [...(formData[field.field_name] || [])];
                                    newList[index] = e.target.value;
                                    setFormData((prev) => ({
                                        ...prev,
                                        [field.field_name]: newList,
                                    }));
                                    }}
                                    sx={{ mb: 1 }}
                                />
                                ))}
                                <Button
                                variant="outlined"
                                size="small"
                                onClick={() =>
                                    setFormData((prev) => ({
                                    ...prev,
                                    [field.field_name]: [...(prev[field.field_name] || []), ''],
                                    }))
                                }
                                >
                                + Add Item
                                </Button>
                            </Box>
                            ) : (
                            <TextField
                                label={field.field_name.replace('_', ' ')}
                                name={field.field_name}
                                type={field.field_type}
                                fullWidth
                                margin="normal"
                                required
                                value={
                                  field.field_type === 'date'
                                    ? formData[field.field_name] || '' // make sure it’s a valid date string or empty
                                    : formData[field.field_name] || ''
                                }
                                onChange={handleInputChange}
                                multiline={field.field_type === 'text'}
                                minRows={field.field_type === 'text' ? 3 : undefined}
                                InputLabelProps={
                                  field.field_type === 'date'
                                    ? { shrink: true }
                                    : {}
                                }
                                sx={{
                                  '& .MuiOutlinedInput-root': {
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
                                  '& input, & textarea': {
                                    color: theme.palette.text.primary,
                                  },
                                }}
                              />

                            )}
                        </Box>
                        ))}

                        <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
                            Generate Contract
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    {/* <Typography variant="h5" gutterBottom>
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
                            Fill the form and click &quot;Save&quot; to see a preview.
                        </Typography>
                    )} */}
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
