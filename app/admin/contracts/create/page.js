// app/lawfirms/create-contract.js
'use client';

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, IconButton } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import TextEditor from '@/app/components/TextEditor';
import { useTheme } from '@emotion/react';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import axiosInstance from '@/lib/axios';


const CreateContract = () => {
  const theme = useTheme()
  const { handleApiError } = useApiErrorHandler();
  const [contractData, setContractData] = useState({
    name: '',
    fields: [{ field_name: '', field_type: 'text', options: [] }],
    body: '',
  });

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...contractData.fields];
    updatedFields[index][field] = value;
    if (field === 'field_type' && value !== 'options') {
      updatedFields[index].options = []; 
    }
    setContractData({ ...contractData, fields: updatedFields });
  };

  const handleAddField = () => {
    setContractData({ ...contractData, fields: [...contractData.fields, { field_name: '', field_type: 'text', options: [] }] });
  };

  // const handleAddOption = (fieldIndex) => {
  //   const updatedFields = [...contractData.fields];
  //   updatedFields[fieldIndex].options.push('');
  //   setContractData({ ...contractData, fields: updatedFields });
  // };

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
    const updatedContractData = {
        ...contractData,
        body: noteDetails.html,
    };

    console.log('Contract data to save:', updatedContractData);

    try {
        const response = await axiosInstance.post('/api/contracts/create', updatedContractData);

        if (response.status === 201) {
            console.log('Contract saved successfully:', response.data);
            alert('Contract saved successfully!');
        } else {
            console.error('Failed to save contract:', response);
            alert('Failed to save contract.');
        }
    } catch (error) {
        handleApiError(error)
    }
};

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom>
        Create New Contract
      </Typography>

      {/* Explanation */}
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Use the text editor below to write the contract body. You can insert placeholders by wrapping field names in double curly braces like 
        <code> {'{{field_name}}'} </code>. These placeholders will be dynamically replaced with the values provided by the client.
      </Typography>

      {/* Contract Name Input */}
      <TextField
        label="Contract Name"
        variant="outlined"
        fullWidth
        value={contractData.name}
        onChange={(e) => setContractData({ ...contractData, name: e.target.value })}
        sx={{ mb: 3, '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: theme.palette.primary.main,
          },
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
          },
        },
        '& input': {
          color: theme.palette.text.primary,
      }, }}
      />

      {/* Dynamic Fields for Contract */}
      {contractData.fields.map((field, index) => (
        <Box key={index} sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Field Name"
              variant="outlined"
              value={field.field_name}
              onChange={(e) => handleFieldChange(index, 'field_name', e.target.value)}
              sx={{ flex: 1, '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
              '& input': {
                color: theme.palette.text.primary,
            }, }}
            />
            {/* <TextField
              select
              label="Field Type"
              variant="outlined"
              value={field.field_type}
              onChange={(e) => handleFieldChange(index, 'field_type', e.target.value)}
              sx={{  width: '150px', '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
              '& input': {
                color: theme.palette.text.primary,
            }, }}
              SelectProps={{ native: true }}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="options">Options</option>
            </TextField> */}
          </Box>

          {/* Conditionally Render Options Input for 'Options' Field Type */}
          {field.field_type === 'options' && (
            <Box sx={{ mt: 2 }}>
              {field.options.map((option, optionIndex) => (
                <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label={`Option ${optionIndex + 1}`}
                    variant="outlined"
                    value={option}
                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                    sx={{ flex: 1, mr: 1, '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& input': {
                      color: theme.palette.text.primary,
                  }, }}
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

      {/* Button to Add Field */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mb: 3 }}>
        <Button variant="outlined" onClick={handleAddField}>
          Add Field
        </Button>
      </Box>

      {/* Integrating TextEditor Component */}
      <TextEditor
        cta="Save Contract"
        onCtaClick={handleSaveContract}
      />
    </Container>
  );
};

export default CreateContract;
