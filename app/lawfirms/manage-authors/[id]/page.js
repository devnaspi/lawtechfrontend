'use client';

import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Autocomplete, CircularProgress } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { useSnackbar } from 'notistack';

const EditAuthor = () => {
  const { id } = useParams();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [authorData, setAuthorData] = useState({
    username: '',
    email: '',
    specialties: [],
  });

  const [loading, setLoading] = useState(true);
  const [existingTags, setExistingTags] = useState([]);

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/lawfirms/authors/${id}/`);
        const author = response.data;

        setAuthorData({
          username: author.user.username,
          email: author.user.email,
          specialties: author.tags.map(tag => tag),
        });

        const tagsResponse = await axiosInstance.get('/api/tags/');
        setExistingTags(tagsResponse.data.results.map(tag => tag.name));
      } catch (error) {
        enqueueSnackbar('Failed to fetch author details', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorDetails();
  }, [id, enqueueSnackbar]);

  const handleSaveAuthor = async () => {
    try {
      const updatedData = {
        username: authorData.username,
        email: authorData.email,
        tags: authorData.specialties,
      };

      await axiosInstance.put(`/api/lawfirms/authors/${id}/`, updatedData);

      enqueueSnackbar('Author updated successfully!', { variant: 'success' });
      router.push('/lawfirms/manage-authors');
    } catch (error) {
      enqueueSnackbar('Failed to update author', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Author
      </Typography>

      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        value={authorData.username}
        disabled
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

      <Autocomplete
        multiple
        options={existingTags || []}
        value={authorData.specialties || []}
        getOptionLabel={(option) => option || ''} 
        onChange={(event, newValue) => setAuthorData({ ...authorData, specialties: newValue })}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label="Specialties" 
            variant="outlined" 
          />
        )}
        sx={{ mb: 3 }}
      />


      <Button variant="contained" onClick={handleSaveAuthor}>
        Save Author
      </Button>
    </Container>
  );
};

export default EditAuthor;
