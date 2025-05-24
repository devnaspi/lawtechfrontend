'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
  Chip,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import TextEditor from '@/app/components/TextEditor';
import axiosInstance from '@/lib/axios';
import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import useApiErrorHandler from '@/utils/useApiErrorHandler';

const EditContractPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { handleApiError } = useApiErrorHandler();
  const router = useRouter();
  const { id } = useParams();

  const [contractData, setContractData] = useState({
    name: '',
    fields: [{ field_name: '', field_type: 'text', options: [] }],
    body: '',
    tags: [],
    lawfirm: null,
  });

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableLawFirms, setAvailableLawFirms] = useState([]);

  useEffect(() => {
    const fetchContractAndOptions = async () => {
      try {
        const [contractRes, tagsRes, lawfirmsRes] = await Promise.all([
          axiosInstance.get(`/api/contracts/${id}`),
          axiosInstance.get('/api/tags'),
          axiosInstance.get('/api/lawfirms'),
        ]);

        const data = contractRes.data;
        setAvailableTags(tagsRes.data.results.map((tag) => tag.name));
        setAvailableLawFirms(lawfirmsRes.data.results);

        setContractData({
          name: data.name,
          fields: data.fields.map((field) => ({
            field_name: field.field_name,
            field_type: field.field_type,
            options: field.options || [],
          })),
          body: data.body,
          tags: data.tags,
          lawfirm: data.lawfirm,
        });
      } catch (error) {
        console.error('Failed to fetch contract or options:', error);
        enqueueSnackbar('Failed to fetch contract details.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchContractAndOptions();
  }, [id, enqueueSnackbar]);

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

  const handleAddOption = (fieldIndex) => {
    const updatedFields = [...contractData.fields];
    updatedFields[fieldIndex].options.push('');
    setContractData({ ...contractData, fields: updatedFields });
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

  const handleSaveContract = async (noteDetails) => {
    setSaveLoading(true);
    const payload = {
      ...contractData,
      body: noteDetails.html,
    };
    try {
      await axiosInstance.put(`/api/contracts/${id}`, payload);
      enqueueSnackbar('Contract updated successfully!', { variant: 'success' });
      router.push('/admin/contracts');
    } catch (error) {
      console.error('Failed to update contract:', error);
      enqueueSnackbar('Failed to update contract.', { variant: 'error' });
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Edit Contract</Typography>

      <TextField
        label="Contract Name"
        variant="outlined"
        fullWidth
        value={contractData.name}
        onChange={(e) => setContractData({ ...contractData, name: e.target.value })}
        sx={{ mb: 3 }}
      />

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Owning Law Firm</InputLabel>
        <Select
          value={contractData.lawfirm || ''}
          label="Owning Law Firm"
          onChange={(e) =>
            setContractData({ ...contractData, lawfirm: e.target.value === '' ? null : parseInt(e.target.value) })
          }
        >
          <MenuItem value="">Praelex Intelligence</MenuItem>
          {availableLawFirms.map((firm) => (
            <MenuItem key={firm.id} value={firm.id}>
              {firm.name} ({firm.user?.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
                <MenuItem value="options">Options</MenuItem>
                <MenuItem value="list">List</MenuItem>
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
              <Button variant="outlined" startIcon={<AddCircleOutline />} onClick={() => handleAddOption(index)}>
                Add Option
              </Button>
            </Box>
          )}
        </Box>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mb: 3 }}>
        <Button variant="outlined" onClick={handleAddField}>Add Field</Button>
      </Box>

      <TextEditor
        cta="Save Contract"
        onCtaClick={handleSaveContract}
        isLoading={saveLoading}
        initialContent={contractData.body}
      />
    </Container>
  );
};

export default EditContractPage;
