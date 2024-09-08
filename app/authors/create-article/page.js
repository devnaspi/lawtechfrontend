'use client';

import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Autocomplete, Chip, IconButton } from '@mui/material';
import { InsertPhoto as InsertPhotoIcon } from '@mui/icons-material';
import TextEditor from '../../components/TextEditor'; // Import the reusable TextEditor component

const CreateArticle = () => {
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    tags: [],
    coverPhoto: null, // State to store the cover photo
  });

  // Existing tags that are available for selection
  const existingTags = ['Legal', 'Finance', 'Health', 'Education', 'Technology'];

  const handleSaveArticle = (noteDetails, attachments) => {
    // Update article data with content from TextEditor
    const updatedArticleData = {
      ...articleData,
      content: noteDetails.html, // Use the HTML content from the editor
    };

    console.log('Article saved', updatedArticleData);
    console.log('Attachments', attachments);

    // Logic to save or update the article
    // e.g., make an API call to save the article
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setArticleData({ ...articleData, coverPhoto: file });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom>
        {articleData.id ? 'Edit Article' : 'Create Article'}
      </Typography>

      {/* Article Form */}
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        value={articleData.title}
        onChange={(e) => setArticleData({ ...articleData, title: e.target.value })}
        sx={{ mb: 4 }}
      />

      {/* Cover Photo Upload */}
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
        

        {/* Tags Input with Autocomplete for Multi-select and Adding New Tags */}
      <Autocomplete
        multiple
        freeSolo
        options={existingTags} // Options for selection
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
      
      {/* Integrating TextEditor Component */}
      <TextEditor
        cta="Save Article" // Call-to-action button text
        onCtaClick={handleSaveArticle} // Handler function for saving the article
      />

    </Container>
  );
};

export default CreateArticle;
