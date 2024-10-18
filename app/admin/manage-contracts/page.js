// app/lawfirms/manage-contracts.js
'use client';

import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, IconButton, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useRouter } from 'next/navigation'; // Import the useRouter hook

const contractsData = [
  { id: 1, name: 'Non-Disclosure Agreement', fields: ['Party A', 'Party B', 'Effective Date'] },
  { id: 2, name: 'Employment Contract', fields: ['Employee Name', 'Position', 'Start Date'] },
];

const ManageContracts = () => {
  const [contracts, setContracts] = useState(contractsData);
  const router = useRouter();

  const handleEditContract = (id) => {
    router.push(`/lawfirms/manage-contracts/${id}`);
  };

  const handleDeleteContract = (id) => {
    setContracts(contracts.filter((contract) => contract.id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Contracts
      </Typography>

      <Grid container spacing={4}>
        {contracts.map((contract) => (
          <Grid item xs={12} sm={6} md={4} key={contract.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{contract.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Fields: {contract.fields.join(', ')}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <IconButton color="primary" onClick={() => handleEditContract(contract.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteContract(contract.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ManageContracts;
