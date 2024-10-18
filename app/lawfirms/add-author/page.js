'use client';

import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Autocomplete, CircularProgress } from '@mui/material';
import axiosInstance from '@/lib/axios';
import { useSnackbar } from 'notistack';
import useApiErrorHandler from '@/utils/useApiErrorHandler';


const AddAuthor = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [authorData, setAuthorData] = useState({
    username: '',
    email: '',
    password: '',
    specialties: [],
  });
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTags, setFetchingTags] = useState(true);
  const { handleApiError } = useApiErrorHandler();


  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axiosInstance.get('/api/tags/');
        setSpecialties(response.data.results.map(tag => tag.name));
      } catch (error) {         
        handleApiError(error);
      } finally {
        setFetchingTags(false);
      }
    };

    fetchTags();
  }, []);

  const handleSaveAuthor = async () => {
    setLoading(true);

    try {
      await axiosInstance.post('/api/lawfirms/authors/register/', {
        username: authorData.username,
        email: authorData.email,
        password: authorData.password,
        tags: authorData.specialties,
      });

      enqueueSnackbar('Author added successfully!', { variant: 'success' });
      setAuthorData({
        username: '',
        email: '',
        password: '',
        specialties: [],
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingTags) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add New Author
      </Typography>

      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        value={authorData.username}
        onChange={(e) => setAuthorData({ ...authorData, username: e.target.value })}
        sx={{ mb: 3 }}
      />

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={authorData.email}
        onChange={(e) => setAuthorData({ ...authorData, email: e.target.value })}
        sx={{ mb: 3 }}
      />

      <TextField
        label="Password"
        variant="outlined"
        type="password"
        fullWidth
        value={authorData.password}
        onChange={(e) => setAuthorData({ ...authorData, password: e.target.value })}
        sx={{ mb: 3 }}
      />

      <Autocomplete
        multiple
        freeSolo
        options={specialties}
        value={authorData.specialties}
        onChange={(event, newValue) => setAuthorData({ ...authorData, specialties: newValue })}
        renderInput={(params) => <TextField {...params} label="Specialties" variant="outlined" />}
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        onClick={handleSaveAuthor}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Author'}
      </Button>
    </Container>
  );
};

export default AddAuthor;
