'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    TextField,
    Chip,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
} from '@mui/material';
import axiosInstance from '@/lib/axios';
import Pagination from '@/app/components/Pagination';


const ContractsList = () => {
    const [contracts, setContracts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [filteredContracts, setFilteredContracts] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [paginationData, setPaginationData] = useState(null);


    const fetchContracts = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/contracts/?page=${page}`);
            const data = response.data.results;
            setPaginationData(response.data);
            setContracts(data);

            const uniqueTags = new Set();
            data.forEach(contract => {
                contract.tags.forEach(tag => uniqueTags.add(tag));
            });
            setTags([...uniqueTags]);
        } catch (error) {
            console.error("Error fetching contracts:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    useEffect(() => {
        const filter = () => {
            let filtered = contracts;

            if (searchQuery) {
                filtered = filtered.filter((contract) =>
                    contract.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (selectedTag) {
                filtered = filtered.filter((contract) => contract.tags.includes(selectedTag));
            }

            setFilteredContracts(filtered);
        };

        filter();
    }, [searchQuery, selectedTag, contracts]);

    return (
        <Container maxWidth="lg" sx={{ mt: 20, mb: 4, minHeight: '80vh' }}>
            {/* Title */}
            <Typography variant="h4" gutterBottom>
                Contracts
            </Typography>

            {/* Search and Filter */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                {/* Search Field */}
                <TextField
                    label="Search Contracts"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Filter by Tags */}
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Tags</InputLabel>
                    <Select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                    >
                        <MenuItem value="">All Tags</MenuItem>
                        {tags.map((tag) => (
                            <MenuItem key={tag} value={tag}>
                                {tag}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Display Loading Spinner */}
            {loading ? (
                <Box display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {/* Contracts List */}
                    {filteredContracts.length > 0 ? (
                        filteredContracts.map((contract) => (
                            <Grid item xs={12} sm={6} md={4} key={contract.id}>
                                <Card
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => router.push(`/readers/contracts/${contract.code}`)}
                                >
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {contract.name}
                                        </Typography>

                                        {contract.lawfirm?.name && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Drafted by <strong>{contract.lawfirm.name}</strong>
                                            </Typography>
                                        )}


                                        {/* Tags List */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                mt: 1,
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {contract.tags.map((tag, index) => (
                                                <Chip
                                                    key={index}
                                                    label={tag}
                                                    size="small"
                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: '200px',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="h6" color="textSecondary">
                                    No contracts available at the moment.
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            )}

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

export default ContractsList;
