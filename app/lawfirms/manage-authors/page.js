// app/lawfirms/manage-authors.js
'use client';

import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, IconButton, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

// Sample data for authors
const authorsData = [
  { id: 1, name: 'Jane Doe', email: 'jane@example.com', specialties: ['Criminal Law', 'Civil Rights'] },
  { id: 2, name: 'John Smith', email: 'john@example.com', specialties: ['Contract Law'] },
];

const ManageAuthors = () => {
  const [authors, setAuthors] = useState(authorsData);

  const handleEditAuthor = (id) => {
    // Logic to navigate to edit author page
    console.log('Edit author:', id);
  };

  const handleDeleteAuthor = (id) => {
    setAuthors(authors.filter((author) => author.id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Authors
      </Typography>

      <Grid container spacing={4}>
        {authors.map((author) => (
          <Grid item xs={12} sm={6} md={4} key={author.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{author.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: {author.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Specialties: {author.specialties.join(', ')}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <IconButton color="primary" onClick={() => handleEditAuthor(author.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteAuthor(author.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ManageAuthors;
