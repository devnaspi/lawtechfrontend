'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

// Sample data for law firms
const lawFirmsData = [
    {
        id: 1,
        name: 'Smith & Associates',
        specialties: ['Criminal Law', 'Family Law'],
    },
    {
        id: 2,
        name: 'Johnson Legal Group',
        specialties: ['Corporate Law', 'Employment Law'],
    },
    {
        id: 3,
        name: 'Miller Law Offices',
        specialties: ['Civil Rights Law', 'Technology Law'],
    },
    // Add more law firm data as needed
];

const LawFirmsList = () => {
    const [lawFirms, setLawFirms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [filteredLawFirms, setFilteredLawFirms] = useState([]);
    const [tags, setTags] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // Fetch law firms data from backend API
        // For now, we're using the sample data above
        const fetchLawFirms = async () => {
            // Uncomment the lines below to fetch from the backend
            // const response = await fetch('/api/lawfirms');
            // const data = await response.json();
            setLawFirms(lawFirmsData); // Replace with `data` once backend is available

            // Fetch unique tags from specialties
            const uniqueTags = [...new Set(lawFirmsData.flatMap(firm => firm.specialties))];
            setTags(uniqueTags);
        };

        fetchLawFirms();
    }, []);

    useEffect(() => {
        // Filter law firms by search query and selected tag
        const filter = () => {
            let filtered = lawFirms;

            if (searchQuery) {
                filtered = filtered.filter((firm) =>
                    firm.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (selectedTag) {
                filtered = filtered.filter((firm) => firm.specialties.includes(selectedTag));
            }

            setFilteredLawFirms(filtered);
        };

        filter();
    }, [searchQuery, selectedTag, lawFirms]);

    return (
        <Container maxWidth="lg" sx={{ mt: 20, mb: 4, minHeight: '80vh' }}>
            {/* Title */}
            <Typography variant="h4" gutterBottom>
                Law Firms
            </Typography>

            {/* Search and Filter */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                {/* Search Field */}
                <TextField
                    label="Search Law Firms"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Filter by Tags */}
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Specialty</InputLabel>
                    <Select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                    >
                        <MenuItem value="">All Specialties</MenuItem>
                        {tags.map((tag) => (
                            <MenuItem key={tag} value={tag}>
                                {tag}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Law Firms List */}
            <Grid container spacing={4}>
                {filteredLawFirms.map((firm) => (
                    <Grid item xs={12} sm={6} md={4} key={firm.id}>
                        <Card
                            sx={{ cursor: 'pointer' }}
                            onClick={() => router.push(`/readers/lawfirms/${firm.id}`)} // Navigate to law firm detail page
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {firm.name}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                                    {firm.specialties.map((specialty, index) => (
                                        <Chip
                                            key={index}
                                            label={specialty}
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

            {/* If no law firms found */}
            {filteredLawFirms.length === 0 && (
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
                        No law firms available at the moment.
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default LawFirmsList;
