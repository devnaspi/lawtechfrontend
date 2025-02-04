'use client';

import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Box, IconButton, CircularProgress } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import TextEditor from '@/app/components/TextEditor';
import axiosInstance from '@/lib/axios';
import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';

const EditContractPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { id } = useParams();
  const [contractData, setContractData] = useState({
    name: '',
    fields: [{ fieldName: '', fieldType: 'text', options: [] }],
    body: '',
  });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axiosInstance.get(`/api/contracts/${id}`);
        const data = response.data;
        setContractData({
          name: data.name,
          fields: data.fields.map((field) => ({
            fieldName: field.field_name,
            fieldType: field.field_type,
            options: field.options || [],
          })),
          body: data.body,
        });
      } catch (error) {
        console.error('Failed to fetch contract:', error);
        enqueueSnackbar('Failed to fetch contract details.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id, enqueueSnackbar]);

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...contractData.fields];
    updatedFields[index][field] = value;
    if (field === 'fieldType' && value !== 'options') {
      updatedFields[index].options = [];
    }
    setContractData({ ...contractData, fields: updatedFields });
  };

  const handleAddField = () => {
    setContractData({
      ...contractData,
      fields: [...contractData.fields, { fieldName: '', fieldType: 'text', options: [] }],
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

    const updatedContractData = {
      name: contractData.name,
      body: noteDetails.html,
      fields: contractData.fields.map((field) => ({
        field_name: field.fieldName,
        field_type: field.fieldType,
        options: field.options,
      })),
      tags: ['law', 'criminal'],
    };

    try {
      await axiosInstance.put(`/api/contracts/${id}`, updatedContractData);
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
      <Typography variant="h4" gutterBottom>
        Edit Contract
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Use the text editor below to modify the contract body. Insert placeholders by wrapping field names in double curly braces like 
        <code> {'{{field_name}}'} </code>. These placeholders will be dynamically replaced with the values provided by the client.
      </Typography>

      <TextField
        label="Contract Name"
        variant="outlined"
        fullWidth
        value={contractData.name}
        onChange={(e) => setContractData({ ...contractData, name: e.target.value })}
        sx={{ mb: 3 }}
      />

      {contractData.fields.map((field, index) => (
        <Box key={index} sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Field Name"
              variant="outlined"
              value={field.fieldName}
              onChange={(e) => handleFieldChange(index, 'fieldName', e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              select
              label="Field Type"
              variant="outlined"
              value={field.fieldType}
              onChange={(e) => handleFieldChange(index, 'fieldType', e.target.value)}
              sx={{ width: '150px' }}
              SelectProps={{ native: true }}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="options">Options</option>
            </TextField>
          </Box>

          {/* Conditionally Render Options Input for 'Options' Field Type */}
          {field.fieldType === 'options' && (
            <Box sx={{ mt: 2 }}>
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
                sx={{ mt: 1 }}
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
