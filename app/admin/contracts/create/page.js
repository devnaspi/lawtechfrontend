// app/lawfirms/create-contract.js
'use client';

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, IconButton } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import TextEditor from '@/app/components/TextEditor';

const CreateContract = () => {
  const [contractData, setContractData] = useState({
    name: '',
    fields: [{ fieldName: '', fieldType: 'text', options: [] }],
    body: '',
  });

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...contractData.fields];
    updatedFields[index][field] = value;
    if (field === 'fieldType' && value !== 'options') {
      updatedFields[index].options = []; // Clear options if the field type is changed to something other than 'options'
    }
    setContractData({ ...contractData, fields: updatedFields });
  };

  const handleAddField = () => {
    setContractData({ ...contractData, fields: [...contractData.fields, { fieldName: '', fieldType: 'text', options: [] }] });
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

  const handleSaveContract = (noteDetails) => {
    const updatedContractData = {
      ...contractData,
      body: noteDetails.html, // Use the HTML content from the editor
    };

    console.log('Contract data:', updatedContractData);
    // Add logic to save contract data to backend
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
        sx={{ mb: 3 }}
      />

      {/* Dynamic Fields for Contract */}
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

      {/* Button to Add Field */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mb: 3 }}>
        <Button variant="outlined" onClick={handleAddField}>
          Add Field
        </Button>
      </Box>

      {/* Integrating TextEditor Component */}
      <TextEditor
        cta="Save Contract" // Change CTA button text
        onCtaClick={handleSaveContract} // Use this handler to save the contract
      />
    </Container>
  );
};

export default CreateContract;
