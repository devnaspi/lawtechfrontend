'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Typography, Autocomplete, Chip, CircularProgress } from '@mui/material';
import TextEditor from '../../../components/TextEditor';
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';

const EditArticle = () => {
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    tags: [],
    categories: [],
    countries: [],
  });

  const [availableTags, setAvailableTags] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const router = useRouter();
  const { handleApiError } = useApiErrorHandler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch article
        const articleRes = await axiosInstance.get(`/api/articles/${id}/`);
        const article = articleRes.data;

        // Fetch options
        const [tagsRes, categoriesRes, countriesRes] = await Promise.all([
          axiosInstance.get('/api/tags/'),
          axiosInstance.get('/api/categories/categories/'),
          axiosInstance.get('/api/categories/countries/')
        ]);

        // Set available options
        setAvailableTags(tagsRes.data.results.map(tag => tag.name));
        setAvailableCategories(categoriesRes.data.results.map(cat => cat.name));
        setAvailableCountries(countriesRes.data.map(c => c.name));

        // Set initial form values
        setArticleData({
          title: article.title,
          content: article.content,
          tags: article.tags.map(t => t.name || t), // fallback for strings
          categories: article.categories.map(c => c.name || c),
          countries: article.countries.map(r => r.name || r),
        });

      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (field, value) => {
    setArticleData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveArticle = async (noteDetails) => {
    try {
      const updatedArticleData = {
        ...articleData,
        content: noteDetails.html,
      };

      await axiosInstance.put(`/api/articles/${id}/`, updatedArticleData);
      router.push('/authors/manage-articles');
    } catch (error) {
      console.error('Failed to update article:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Edit Article</Typography>

      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        value={articleData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        sx={{ mb: 4 }}
      />

      {/* Tags */}
      <Autocomplete
        multiple
        freeSolo
        options={availableTags}
        value={articleData.tags}
        onChange={(e, newVal) => handleInputChange('tags', newVal)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip key={option} label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => <TextField {...params} label="Tags" variant="outlined" />}
        sx={{ mb: 4 }}
      />

      {/* Categories */}
      <Autocomplete
        multiple
        options={availableCategories}
        value={articleData.categories}
        onChange={(e, newVal) => handleInputChange('categories', newVal)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip key={option} label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => <TextField {...params} label="Categories" variant="outlined" />}
        sx={{ mb: 4 }}
      />

      {/* Countries */}
      <Autocomplete
        multiple
        options={availableCountries}
        value={articleData.countries}
        onChange={(e, newVal) => handleInputChange('countries', newVal)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip key={option} label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => <TextField {...params} label="Countries" variant="outlined" />}
        sx={{ mb: 4 }}
      />

      {/* Text Editor */}
      <TextEditor
        initialContent={articleData.content}
        cta="Update Article"
        onCtaClick={handleSaveArticle}
      />
    </Container>
  );
};

export default EditArticle;
