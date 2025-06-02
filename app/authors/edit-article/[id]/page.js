'use client';

import React, { useState, useEffect } from 'react';
import {
  Container, Box, TextField, Typography, Autocomplete, Chip, CircularProgress
} from '@mui/material';
import TextEditor from '../../../components/TextEditor';
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';

const EditArticle = () => {
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    tags: [],
    countries: [],
    contributingAuthors: [],
  });

  const [availableTags, setAvailableTags] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const router = useRouter();
  const { handleApiError } = useApiErrorHandler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleRes = await axiosInstance.get(`/api/articles/${id}/`);
        const article = articleRes.data;

        const [tagsRes, countriesRes, authorsRes] = await Promise.all([
          axiosInstance.get('/api/tags/'),
          axiosInstance.get('/api/categories/countries/'),
          axiosInstance.get('/api/authors/colleagues/')
        ]);

        setAvailableTags(tagsRes.data.results.map(tag => tag.name));
        setAvailableCountries(countriesRes.data.map(c => c.name));
        setAvailableAuthors(authorsRes.data); // Full object

        setArticleData({
          title: article.title,
          content: article.content,
          tags: article.tags.map(t => t.name || t),
          countries: article.countries.map(r => r.name || r),
          contributingAuthors: article.contributing_authors || [], // assuming backend returns this field
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
        contributing_authors_ids: articleData.contributingAuthors.map(a => a.id),
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

      {/* Contributing Authors */}
      <Autocomplete
        multiple
        options={availableAuthors}
        getOptionLabel={(option) => option.user?.username || ''}
        value={articleData.contributingAuthors}
        onChange={(e, newVal) => handleInputChange('contributingAuthors', newVal)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip key={option.id} label={option.user?.username || ''} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => <TextField {...params} label="Contributing Authors" variant="outlined" />}
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
