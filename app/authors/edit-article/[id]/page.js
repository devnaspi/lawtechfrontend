'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, Autocomplete, Chip } from '@mui/material';
import TextEditor from '../../../components/TextEditor';
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import CircularProgress from '@mui/material/CircularProgress';


const EditArticle = () => {
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    tags: [],
    categories: [],
    regions: [],
  });

  const [existingTags, setExistingTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();
  const { handleApiError } = useApiErrorHandler();


  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/articles/${id}/`);
        const article = response.data;

        setArticleData({
          title: article.title,
          content: article.content,
          tags: article.tags.map(tag => tag),
          categories: article.categories.map(category => category),
          regions: article.regions.map(region => region),
        });

        const [tagsRes, categoriesRes, regionsRes] = await Promise.all([
          axiosInstance.get('/api/tags/'),
          axiosInstance.get('/api/categories/categories/'),
          axiosInstance.get('/api/categories/regions/')
        ]);

        setExistingTags(tagsRes.data.results.map(tag => tag.name));
        setCategories(categoriesRes.data.results.map(category => category.name));
        setRegions(regionsRes.data.results.map(region => region.name));

      } catch (error) {
        handleApiError(error)
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [id]);

  const handleSaveArticle = async (noteDetails, attachments) => {
    try {
      const updatedArticleData = {
        ...articleData,
        content: noteDetails.html,
      };

      await axiosInstance.put(`/api/articles/${id}/`, updatedArticleData);

      console.log('Article updated successfully');
      router.push('/authors/manage-articles');
    } catch (error) {
      console.error('Failed to update article:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setArticleData({
      ...articleData,
      [field]: value,
    });
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
      {/* Title */}
      <Typography variant="h4" gutterBottom>
        Edit Article
      </Typography>

      {/* Article Form */}
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        value={articleData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        sx={{ mb: 4 }}
      />

      {/* Tags Input with Autocomplete for Multi-select and Adding New Tags */}
      <Autocomplete
        multiple
        freeSolo
        options={existingTags}
        value={articleData.tags}
        onChange={(event, newValue) => handleInputChange('tags', newValue)}
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

      {/* Categories Autocomplete */}
      <Autocomplete
        multiple
        options={categories}
        value={articleData.categories}
        onChange={(event, newValue) => handleInputChange('categories', newValue)}
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

      {/* Regions Autocomplete */}
      <Autocomplete
        multiple
        options={regions}
        value={articleData.regions}
        onChange={(event, newValue) => handleInputChange('regions', newValue)}
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

      {/* Integrating TextEditor Component */}
      <TextEditor
        initialContent={articleData.content}
        cta="Update Article" 
        onCtaClick={handleSaveArticle} 
      />
    </Container>
  );
};

export default EditArticle;
