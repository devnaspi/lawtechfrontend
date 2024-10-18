'use client';

import React, { useEffect, useState } from 'react';
import { Container, TextField, Typography, Box, CircularProgress, Button, Stack } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';

const ContractDetailPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [contractData, setContractData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const response = await axiosInstance.get(`/api/contracts/${id}`);
                setContractData(response.data);
            } catch (error) {
                console.error('Failed to fetch contract details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContract();
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!contractData) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h5">Contract not found.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                {contractData.name}
            </Typography>

            {contractData.fields.map((field, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                    <TextField
                        label={field.field_name}
                        variant="outlined"
                        fullWidth
                        value={field.field_type}
                        disabled
                    />
                </Box>
            ))}

            <Box sx={{ mb: 3 }}>
                <Typography variant="h6">Contract Body</Typography>
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        p: 2,
                        mt: 1,
                        backgroundColor: '#f5f5f5',
                    }}
                    dangerouslySetInnerHTML={{ __html: contractData.body }}
                />
            </Box>

            <Stack direction="row" spacing={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/admin/contracts')}
                >
                    Back to Contracts
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => router.push(`/admin/contracts/${id}/edit`)}
                >
                    Edit Contract
                </Button>
            </Stack>
        </Container>
    );
};

export default ContractDetailPage;
