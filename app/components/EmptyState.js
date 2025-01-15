import React from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FileQuestion } from 'lucide-react';

const EmptyState = ({
  message = "No items found",
  icon: Icon = FileQuestion,
  description = "Get started by creating your first item"
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        p: 8,
        textAlign: 'center',
        bgcolor: 'background.default',
        borderRadius: 2,
        border: 1,
        borderStyle: 'dashed',
        borderColor: 'divider'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 64,
          height: 64,
          mb: 4,
          borderRadius: '50%',
          bgcolor: 'grey.100'
        }}
      >
        <IconButton>
          <Icon
            style={{
              width: 32,
              height: 32,
              color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.grey[600]
            }}
          />
        </IconButton>
      </Box>
      <Typography variant="h6" component="h3" sx={{ mb: 2, color: 'text.primary' }}>
        {message}
      </Typography>
      <Typography variant="body2" sx={{ mb: 6, color: 'text.secondary' }}>
        {description}
      </Typography>
    </Paper>
  );
};

export default EmptyState;
