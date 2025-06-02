'use client';

import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Box,
    Chip,
} from '@mui/material';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Pagination from '@/app/components/Pagination';

const ContractsPage = () => {
    const router = useRouter();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginationData, setPaginationData] = useState(null);

    const fetchContracts = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/contracts/lawfirm?page=${page}`);
            setContracts(response.data.results);
            setPaginationData(response.data);
        } catch (error) {
            console.error('Failed to fetch contracts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    if (loading) {
        return (
             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Contracts
            </Typography>

            <Grid container spacing={4}>
                {contracts.length > 0 ? (
                    contracts.map((contract) => (
                        <Grid item xs={12} sm={6} md={4} key={contract.id}>
                            <Card
                                onClick={() => router.push(`/lawfirms/contracts/${contract.code}`)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {contract.name}
                                    </Typography>

                                    {/* Tags */}
                                    {contract.tags && contract.tags.length > 0 && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                mt: 1,
                                                gap: 0.5,
                                            }}
                                        >
                                            {contract.tags.map((tag, index) => (
                                                <Chip
                                                    key={index}
                                                    label={tag}
                                                    size="small"
                                                />
                                            ))}
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '50vh',
                        }}
                    >
                        <Typography variant="h6" color="textSecondary">
                            No contracts found.
                        </Typography>
                    </Box>
                )}
            </Grid>

            {paginationData && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        data={paginationData}
                        limit={10}
                        onPageChange={(page) => fetchContracts(page)}
                    />
                </Box>
            )}
        </Container>
    );
};

export default ContractsPage;
