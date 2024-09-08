'use client';

import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography, TextField, Button } from '@mui/material';

const ContractDetail = ({ contractId }) => {
    const [formFields, setFormFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        // Fetch required fields for the contract from the backend
        const fetchContractFields = async () => {
            const response = await fetch(`/api/contracts/${contractId}`);
            const data = await response.json();
            setFormFields(data.fields); // Expected to be [{ name: 'companyName', label: 'Company Name', type: 'text', required: true }, ...]
        };
        fetchContractFields();
    }, [contractId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        // Send the filled form data to the backend to generate a preview
        const response = await fetch('/api/contracts/preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contractId, formData }),
        });
        const result = await response.json();
        setPreviewUrl(result.previewUrl);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 20, mb: 4, minHeight: '80vh' }}>
            <Grid container spacing={4}>
                {/* Form Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom>
                        Fill Contract Details
                    </Typography>
                    <Box component="form">
                        {formFields.map((field) => (
                            <TextField
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                required={field.required}
                                fullWidth
                                margin="normal"
                                onChange={handleInputChange}
                            />
                        ))}
                        <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
                            Save
                        </Button>
                    </Box>
                </Grid>

                {/* Preview Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom>
                        Contract Preview
                    </Typography>
                    {previewUrl ? (
                        <Box
                            component="iframe"
                            src={previewUrl}
                            sx={{ width: '100%', height: '500px', border: 'none' }}
                        />
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            Fill the form and click "Save" to see a preview.
                        </Typography>
                    )}
                    {previewUrl && (
                        <Button variant="outlined" sx={{ mt: 2 }} href={previewUrl} download>
                            Download Contract
                        </Button>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ContractDetail;
