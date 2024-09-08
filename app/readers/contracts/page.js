'use client';

import React, { useEffect, useState } from 'react';
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
} from '@mui/material';

// Sample data for contracts
const contractsData = [
    {
        id: 1,
        name: 'Non-Disclosure Agreement',
        lawFirm: 'Smith & Associates',
        tags: ['Confidentiality', 'Legal', 'NDA'],
    },
    {
        id: 2,
        name: 'Employment Contract',
        lawFirm: 'Johnson Legal Group',
        tags: ['Employment', 'HR', 'Legal'],
    },
    {
        id: 3,
        name: 'Partnership Agreement',
        lawFirm: 'Miller Law Offices',
        tags: ['Partnership', 'Business', 'Agreement'],
    },
    // Add more contract data as needed
];

const ContractsList = () => {
    const [contracts, setContracts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [filteredContracts, setFilteredContracts] = useState([]);
    const [tags, setTags] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // Fetch contracts data from backend API
        // For now, we're using the sample data above
        const fetchContracts = async () => {
            // Uncomment the lines below to fetch from the backend
            // const response = await fetch('/api/contracts');
            // const data = await response.json();
            setContracts(contractsData); // Replace with `data` once backend is available

            // Fetch tags from backend
            // Uncomment and adjust as needed
            // const tagsResponse = await fetch('/api/tags');
            // const tagsData = await tagsResponse.json();
            setTags(['Confidentiality', 'Legal', 'NDA', 'Employment', 'HR', 'Business', 'Agreement', 'Partnership']); // Replace with tagsData once backend is available
        };

        fetchContracts();
    }, []);

    useEffect(() => {
        // Filter contracts by search query and selected tag
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

            {/* Contracts List */}
            <Grid container spacing={4}>
                {filteredContracts.map((contract) => (
                    <Grid item xs={12} sm={6} md={4} key={contract.id}>
                        <Card
                            sx={{ cursor: 'pointer' }}
                            onClick={() => router.push(`/readers/contracts/${contract.id}`)} // Navigate to contract detail page
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {contract.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Created by: {contract.lawFirm}
                                </Typography>

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
                ))}
            </Grid>

            {/* If no contracts found */}
            {filteredContracts.length === 0 && (
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
            )}
        </Container>
    );
};

export default ContractsList;
