'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, Autocomplete, Chip, CircularProgress, Grid } from '@mui/material';
import { InsertPhoto as InsertPhotoIcon } from '@mui/icons-material';
import TextEditor from '../../components/TextEditor'; 
import axiosInstance from '@/lib/axios';
import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/material/styles';


const CreateArticle = () => {
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    tags: [],
    contributingAuthors: [],  // NEW
    countries: [],
    coverPhoto: null,
  });
  
  
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);


  const [availableAuthors, setAvailableAuthors] = useState([]);

  const theme = useTheme();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const tagsResponse = await axiosInstance.get('/api/tags');
        const authorsResponse = await axiosInstance.get('/api/authors');
        const countriesResponse = await axiosInstance.get('/api/categories/countries');
        
        setAvailableTags(tagsResponse.data.results);
        setAvailableCountries(countriesResponse.data);

        setAvailableAuthors(Array.isArray(authorsResponse.data.results) ? authorsResponse.data.results : []);
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
    updatedArticleData.countries.forEach(region => formData.append('countries[]', region));

    updatedArticleData.contributingAuthors.forEach(author =>
      formData.append('contributing_authors_ids[]', author.id)
    );

    if (updatedArticleData.coverPhoto) {
      formData.append('cover_picture', updatedArticleData.coverPhoto);
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/articles/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      enqueueSnackbar('Article created successfully!', { variant: 'success' });
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
        sx={{
          mb: 4,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
          '& input': {
            color: theme.palette.text.primary,
          },
        }}
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
            sx={{ mt: 4, mb: 4, '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
            '& input': {
              color: theme.palette.text.primary,
            },}}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Autocomplete
            multiple
            options={availableAuthors}
            getOptionLabel={(option) => option.user.username}
            value={articleData.contributingAuthors}
            onChange={(event, newValue) => setArticleData({ ...articleData, contributingAuthors: newValue })}
            renderTags={(value, getTagProps) =>
              value.map((author, index) => (
                <Chip
                  variant="outlined"
                  label={author.user.username}
                  {...getTagProps({ index })}
                  key={author.id}
                />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Contributing Authors" variant="outlined" />}
            sx={{ mt: 4, mb: 4, '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
            '& input': {
              color: theme.palette.text.primary,
            }, }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Autocomplete
            multiple
            options={availableCountries.map((region) => region.name)}
            value={articleData.countries}
            onChange={(event, newValue) => setArticleData({ ...articleData, countries: newValue })}
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
            renderInput={(params) => <TextField {...params} label="Countries" variant="outlined" />}
            sx={{ mt: 4, mb: 4, '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
            '& input': {
              color: theme.palette.text.primary,
            }, }}
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
