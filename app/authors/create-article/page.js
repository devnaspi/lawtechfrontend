'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, Autocomplete, Chip, CircularProgress, Grid } from '@mui/material';
import { InsertPhoto as InsertPhotoIcon } from '@mui/icons-material';
import TextEditor from '../../components/TextEditor'; 
import axiosInstance from '@/lib/axios';
import { useSnackbar } from 'notistack';

const CreateArticle = () => {
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    tags: [],
    categories: [],
    regions: [],
    coverPhoto: null,
  });
  
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const tagsResponse = await axiosInstance.get('/api/tags');
        const categoriesResponse = await axiosInstance.get('/api/categories/categories');
        const regionsResponse = await axiosInstance.get('/api/categories/regions');
        
        setAvailableTags(tagsResponse.data.results);
        setAvailableCategories(categoriesResponse.data.results);
        setAvailableRegions(regionsResponse.data.results);
      } catch (error) {
        console.error('Failed to fetch options:', error);
        enqueueSnackbar('Failed to load options. Please try again.', { variant: 'error' });
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleSaveArticle = async (noteDetails, attachments) => {
    const updatedArticleData = {
        ...articleData,
        content: noteDetails.html,
    };

    const formData = new FormData();
    formData.append('title', updatedArticleData.title);
    formData.append('content', updatedArticleData.content);
    
    updatedArticleData.tags.forEach(tag => formData.append('tags[]', tag));
    updatedArticleData.categories.forEach(category => formData.append('categories[]', category));
    updatedArticleData.regions.forEach(region => formData.append('regions[]', region));

    if (updatedArticleData.coverPhoto) {
      formData.append('cover_picture', updatedArticleData.coverPhoto);
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/articles/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      enqueueSnackbar('Article created successfully!', { variant: 'success' });
      console.log('Article saved successfully:', response.data);
    } catch (error) {
      console.error('Failed to create article:', error);
      enqueueSnackbar('Failed to create article. Please try again.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setArticleData({ ...articleData, coverPhoto: file });
    }
  };

  if (loadingOptions) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom>
        {articleData.id ? 'Edit Article' : 'Create Article'}
      </Typography>

      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        value={articleData.title}
        onChange={(e) => setArticleData({ ...articleData, title: e.target.value })}
        sx={{ mb: 4 }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button variant="outlined" component="label" startIcon={<InsertPhotoIcon />}>
          Upload Cover Photo
          <input type="file" accept="image/*" hidden onChange={handleCoverPhotoChange} />
        </Button>
        {articleData.coverPhoto && (
          <Typography variant="body2" sx={{ ml: 2 }}>
            {articleData.coverPhoto.name}
          </Typography>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Autocomplete
            multiple
            freeSolo
            options={availableTags.map((tag) => tag.name)}
            value={articleData.tags}
            onChange={(event, newValue) => setArticleData({ ...articleData, tags: newValue })}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Tags" variant="outlined" />}
            sx={{ mt: 4, mb: 4 }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Autocomplete
            multiple
            options={availableCategories.map((category) => category.name)}
            value={articleData.categories}
            onChange={(event, newValue) => setArticleData({ ...articleData, categories: newValue })}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Categories" variant="outlined" />}
            sx={{ mt: 4, mb: 4 }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Autocomplete
            multiple
            options={availableRegions.map((region) => region.name)}
            value={articleData.regions}
            onChange={(event, newValue) => setArticleData({ ...articleData, regions: newValue })}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Regions" variant="outlined" />}
            sx={{ mt: 4, mb: 4 }}
          />
        </Grid>
      </Grid>

      <TextEditor
        cta={loading ? 'Saving...' : 'Save Article'}
        onCtaClick={handleSaveArticle}
        disabled={loading}
      />
    </Container>
  );
};

export default CreateArticle;
