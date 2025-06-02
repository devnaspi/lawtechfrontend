'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Stack,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
    </Box>
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

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Law Firm:
        </Typography>
        <Typography variant="body1">
          {contractData.lawfirm?.name || 'Praelex Intelligence'}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Tags:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {contractData.tags && contractData.tags.length > 0 ? (
            contractData.tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="outlined" />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No tags assigned.
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Fields:
        </Typography>
        <Grid container spacing={2}>
          {contractData.fields.map((field, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {field.field_name}
                </Typography>
                <Typography variant="body2">{field.field_type}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Contract Body:
        </Typography>
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            p: 2,
            mt: 1,
          }}
          dangerouslySetInnerHTML={{ __html: contractData.body }}
        />
      </Box>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="primary" onClick={() => router.push('/lawfirms/contracts')}>
          Back to Contracts
        </Button>
      </Stack>
    </Container>
  );
};

export default ContractDetailPage;
