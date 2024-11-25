'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, CircularProgress, Box } from '@mui/material';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Pagination from '@/app/components/Pagination';


const ContractsPage = () => {
    const router = useRouter();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginationData, setPaginationData] = useState(null);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await axiosInstance.get('/api/contracts/');
                setContracts(response.data.results);
                setPaginationData(response.data);
            } catch (error) {
                console.error('Failed to fetch contracts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();
    }, []);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Contracts
            </Typography>
            
            <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/admin/contracts/create')}
                sx={{ mb: 4 }}
            >
                Create New Contract
            </Button>

            <Grid container spacing={4}>
                {contracts.length > 0 ? (
                    contracts.map((contract) => (
                        <Grid item xs={12} sm={6} md={4} key={contract.id}>
                            <Card onClick={() => router.push(`/admin/contracts/${contract.id}`)} sx={{ cursor: 'pointer' }}>
                                <CardContent>
                                    <Typography variant="h6">{contract.name}</Typography>
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
                        onPageChange={(page) => fetchArticles(page)}
                    />
                </Box>
            )}
        </Container>
    );
};

export default ContractsPage;
