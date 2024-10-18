'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';

const lawFirmDetailData = {
    id: 1,
    name: 'Smith & Associates',
    address: '123 Legal St, Lawtown, LT 12345',
    specialties: ['Criminal Law', 'Family Law'],
    articles: [
        { id: 1, title: 'Understanding Criminal Law' },
        { id: 2, title: 'Family Law: What You Need to Know' },
    ],
    contracts: [
        { id: 1, name: 'Non-Disclosure Agreement' },
        { id: 2, name: 'Employment Contract' },
    ],
    description: 'Smith & Associates is a renowned law firm specializing in criminal and family law. They have represented numerous high-profile cases and have a team of expert lawyers committed to justice.',
};

const LawFirmDetail = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [lawFirm, setLawFirm] = useState(null);

    useEffect(() => {
        const fetchLawFirmDetails = async () => {
            setLawFirm(lawFirmDetailData);
        };

        fetchLawFirmDetails();
    }, [id]);

    if (!lawFirm) {
        return (
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5">Law firm not found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 20, mb: 4 }}>
            {/* Law Firm Name */}
            <Typography variant="h4" gutterBottom>
                {lawFirm.name}
            </Typography>

            {/* Law Firm Details */}
            <Typography variant="body1" gutterBottom>
                {lawFirm.description}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Address: {lawFirm.address}
            </Typography>

            {/* Specialties */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1, mb: 4 }}>
                {lawFirm.specialties.map((specialty, index) => (
                    <Chip key={index} label={specialty} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Articles by Authors */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Articles by Authors
                </Typography>
                <List>
                    {lawFirm.articles.map((article) => (
                        <ListItem key={article.id}>
                            <ListItemText
                                primary={article.title}
                                onClick={() => router.push(`/readers/articles/${article.id}`)}
                                sx={{ cursor: 'pointer' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Contracts by Authors */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Contracts by Authors
                </Typography>
                <List>
                    {lawFirm.contracts.map((contract) => (
                        <ListItem key={contract.id}>
                            <ListItemText
                                primary={contract.name}
                                onClick={() => router.push(`/readers/contracts/${contract.id}`)}
                                sx={{ cursor: 'pointer' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
};

export default LawFirmDetail;
