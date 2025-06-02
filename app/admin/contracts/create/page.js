'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Autocomplete,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import TextEditor from '@/app/components/TextEditor';
import { useTheme } from '@emotion/react';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import axiosInstance from '@/lib/axios';

const CreateContract = () => {
  const theme = useTheme();
  const { handleApiError } = useApiErrorHandler();

  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableLawFirms, setAvailableLawFirms] = useState([]);

  const [contractData, setContractData] = useState({
    name: '',
    fields: [{ field_name: '', field_type: 'text', options: [] }],
    body: '',
    tags: [],
    lawfirm_id: null,
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [tagsRes, lawfirmsRes] = await Promise.all([
          axiosInstance.get('/api/tags'),
          axiosInstance.get('/api/lawfirms'),
        ]);

        setAvailableTags(tagsRes.data.results.map((tag) => tag.name));
        setAvailableLawFirms(lawfirmsRes.data.results);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...contractData.fields];
    updatedFields[index][field] = value;
    if (field === 'field_type' && value !== 'options') {
      updatedFields[index].options = [];
    }
    setContractData({ ...contractData, fields: updatedFields });
  };

  const handleAddField = () => {
    setContractData({
      ...contractData,
      fields: [...contractData.fields, { field_name: '', field_type: 'text', options: [] }],
    });
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...contractData.fields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setContractData({ ...contractData, fields: updatedFields });
  };

  const handleRemoveOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...contractData.fields];
    updatedFields[fieldIndex].options.splice(optionIndex, 1);
    setContractData({ ...contractData, fields: updatedFields });
  };

  const handleAddOption = (fieldIndex) => {
    const updatedFields = [...contractData.fields];
    updatedFields[fieldIndex].options.push('');
    setContractData({ ...contractData, fields: updatedFields });
  };

  const handleSaveContract = async (noteDetails) => {
    const payload = {
      ...contractData,
      body: noteDetails.html,
    };

    try {
      const response = await axiosInstance.post('/api/contracts/create', payload);
      if (response.status === 201) {
        alert('Contract saved successfully!');
      } else {
        alert('Failed to save contract.');
      }
    } catch (error) {
      handleApiError(error);
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Create New Contract</Typography>

      <TextField
        label="Contract Name"
        variant="outlined"
        fullWidth
        value={contractData.name}
        onChange={(e) => setContractData({ ...contractData, name: e.target.value })}
        sx={{ mb: 3 }}
      />

      {/* Lawfirm Select */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Owning Law Firm</InputLabel>
        <Select
          value={contractData.lawfirm_id || ''}
          label="Owning Law Firm"
          onChange={(e) =>
            setContractData({ ...contractData, lawfirm_id: e.target.value === '' ? null : parseInt(e.target.value) })
          }
        >
          {availableLawFirms.map((firm) => (
            <MenuItem key={firm.id} value={firm.id}>
              {firm.name} ({firm.user?.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Tags */}
      <Autocomplete
        multiple
        freeSolo
        options={availableTags}
        value={contractData.tags}
        onChange={(e, newValue) => setContractData({ ...contractData, tags: newValue })}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => <TextField {...params} label="Tags" variant="outlined" />}
        sx={{ mb: 4 }}
      />

      {/* Fields */}
      {contractData.fields.map((field, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Field Name"
              variant="outlined"
              value={field.field_name}
              onChange={(e) => handleFieldChange(index, 'field_name', e.target.value)}
              fullWidth
            />
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel>Field Type</InputLabel>
              <Select
                value={field.field_type}
                onChange={(e) => handleFieldChange(index, 'field_type', e.target.value)}
                label="Field Type"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="list">List</MenuItem>
                <MenuItem value="options">Options</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {field.field_type === 'options' && (
            <Box sx={{ mt: 1 }}>
              {field.options.map((option, optionIndex) => (
                <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label={`Option ${optionIndex + 1}`}
                    variant="outlined"
                    value={option}
                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                    sx={{ flex: 1, mr: 1 }}
                  />
                  <IconButton onClick={() => handleRemoveOption(index, optionIndex)} color="error">
                    <RemoveCircleOutline />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddCircleOutline />}
                onClick={() => handleAddOption(index)}
              >
                Add Option
              </Button>
            </Box>
          )}
        </Box>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mb: 3 }}>
        <Button variant="outlined" onClick={handleAddField}>
          Add Field
        </Button>
      </Box>

      <TextEditor cta="Save Contract" onCtaClick={handleSaveContract} />
    </Container>
  );
};

export default CreateContract;
