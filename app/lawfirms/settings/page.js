'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Avatar, Chip, Stack, Autocomplete, CircularProgress, Card, CardContent } from '@mui/material';
import axiosInstance from '@/lib/axios';
import { useSnackbar } from 'notistack';

const LawFirmSettings = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    name: '',
    website: '',
    tags: [],
    email: '',
    username: '',
    logo: null,
  });

  const [existingLogo, setExistingLogo] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [lawfirmRes, tagsRes] = await Promise.all([
          axiosInstance.get('/api/lawfirms/profile/'),
          axiosInstance.get('/api/tags/')
        ]);

        const lawfirm = lawfirmRes.data;
        setFormData({
          name: lawfirm.name || '',
          website: lawfirm.website || '',
          tags: lawfirm.tags || [],
          email: lawfirm.user.email,
          username: lawfirm.user.username,
          logo: null,
        });
        setExistingLogo(lawfirm.logo);
        setAvailableTags(tagsRes.data.results.map(tag => tag.name));
      } catch (err) {
        enqueueSnackbar('Failed to load profile', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('website', formData.website);
    formData.tags.forEach(tag => payload.append('tags[]', tag));
    if (formData.logo) {
      payload.append('logo', formData.logo);
    }

    try {
      await axiosInstance.put('/api/lawfirms/profile/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Update failed. Please try again.', { variant: 'error' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, logo: file });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '80vh', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>

      <Card>
        <CardContent>
          <Stack spacing={4}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={formData.logo ? URL.createObjectURL(formData.logo) : existingLogo}
                alt="Logo"
                sx={{ width: 64, height: 64 }}
              />
              <Button variant="outlined" component="label">
                Upload Logo
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
            </Box>

            {/* Name & Website */}
            <TextField
              label="Law Firm Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <TextField
              label="Website"
              fullWidth
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />

            {/* Tags */}
            <Autocomplete
              multiple
              options={availableTags}
              freeSolo
              value={formData.tags}
              onChange={(e, value) => setFormData({ ...formData, tags: value })}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => <TextField {...params} label="Tags" />}
            />

            {/* User Info (read-only) */}
            <TextField label="Email" value={formData.email} fullWidth disabled />
            <TextField label="Username" value={formData.username} fullWidth disabled />

            {/* Save */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={handleSubmit}>
                Save Changes
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LawFirmSettings;
