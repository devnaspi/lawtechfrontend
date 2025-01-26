'use client';

import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Autocomplete, CircularProgress } from '@mui/material';
import axiosInstance from '@/lib/axios';
import { useSnackbar } from 'notistack';
import useApiErrorHandler from '@/utils/useApiErrorHandler';


const AddAuthor = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [authorData, setAuthorData] = useState({
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const { handleApiError } = useApiErrorHandler();

  const handleSaveAuthor = async () => {
    setLoading(true);

    try {
      await axiosInstance.post('/api/lawfirms/authors/invite/', {
        email: authorData.email,
      });

      enqueueSnackbar('An invitation has been sent to their email!', { variant: 'success' });
      setAuthorData({
        email: '',
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add New Author
      </Typography>

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={authorData.email}
        onChange={(e) => setAuthorData({ ...authorData, email: e.target.value })}
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        onClick={handleSaveAuthor}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Invite Author'}
      </Button>
    </Container>
  );
};

export default AddAuthor;
