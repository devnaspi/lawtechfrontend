'use client';

import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, IconButton, Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import Pagination from '@/app/components/Pagination';
import EmptyState from '@/app/components/EmptyState';

const ManageAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [paginationData, setPaginationData] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  React.useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axiosInstance.get('/api/lawfirms/authors/');
        setAuthors(response.data.results);
        setPaginationData(response.data);
        setLoading(false);
      } catch (error) {
        enqueueSnackbar('Failed to fetch authors', { variant: 'error' });
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [enqueueSnackbar]);

  const handleEditAuthor = (id) => {
    router.push(`/lawfirms/manage-authors/${id}`);
  };

  const handleOpenDeleteDialog = (author) => {
    setSelectedAuthor(author);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedAuthor(null);
  };

  const handleDeleteAuthor = async () => {
    if (!selectedAuthor) return;
    try {
      await axiosInstance.delete(`/api/lawfirms/authors/${selectedAuthor.id}/`);
      setAuthors(authors.filter((author) => author.id !== selectedAuthor.id));
      enqueueSnackbar('Author deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to delete author', { variant: 'error' });
    } finally {
      handleCloseDeleteDialog(); 
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
        Manage Authors
      </Typography>

      {authors.length === 0 ? (
        <EmptyState
          message="No authors yet" 
          description="Start by inviting your first author to the law firm"
        />
      ) : (
        <Grid container spacing={4}>
          {authors.map((author) => (
            <Grid item xs={12} sm={6} md={4} key={author.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{author.user.username}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Email: {author.user.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Specialties: {author.tags.map(tag => tag).join(', ')}
                  </Typography>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton color="primary" onClick={() => handleEditAuthor(author.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleOpenDeleteDialog(author)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete author `&quot;`{selectedAuthor?.user?.username}`&quot;`? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAuthor} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {paginationData && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        data={paginationData}
                        limit={10}
                        onPageChange={(page) => fetchArticles(page)}
                    />
                </Box>
            )}
    </Container>
  );
};

export default ManageAuthors;
