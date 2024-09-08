// app/lawfirms/add-author.js
'use client';

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Autocomplete } from '@mui/material';

const AddAuthor = () => {
  const [authorData, setAuthorData] = useState({
    name: '',
    email: '',
    specialties: [],
  });

  const specialties = ['Criminal Law', 'Civil Rights', 'Contract Law', 'Family Law', 'Technology Law']; // Example specialties

  const handleSaveAuthor = () => {
    console.log('Author data:', authorData);
    // Add logic to save author data to backend
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add New Author
      </Typography>

      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        value={authorData.name}
        onChange={(e) => setAuthorData({ ...authorData, name: e.target.value })}
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
        options={specialties}
        value={authorData.specialties}
        onChange={(event, newValue) => setAuthorData({ ...authorData, specialties: newValue })}
        renderInput={(params) => <TextField {...params} label="Specialties" variant="outlined" />}
        sx={{ mb: 3 }}
      />

      <Button variant="contained" onClick={handleSaveAuthor}>
        Save Author
      </Button>
    </Container>
  );
};

export default AddAuthor;
