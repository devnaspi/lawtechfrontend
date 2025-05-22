'use client';

import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography, IconButton, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/axios';

const LawFirmHeader = () => {
  const { auth } = useAuth();
  const router = useRouter();

  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSettingsClick = () => {
    router.push('/lawfirms/settings');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/api/lawfirms/profile/');
        setLogo(res.data.logo);
      } catch (err) {
        console.error('Failed to fetch law firm profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      alignItems: 'center', 
      padding: '10px 20px', 
      backgroundColor: '#1E1E1E', 
      color: '#fff',
      height: '60px',
    }}>
      <IconButton onClick={handleSettingsClick} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Avatar src={logo || ''} alt="Logo" />
        )}
        <Box>
          <Typography variant="subtitle1" color="white" fontSize={14}>
            {auth?.user?.username || 'User'}
          </Typography>
          <Typography variant="caption" color="gray">
            {auth?.user?.email}
          </Typography>
        </Box>
      </IconButton>
    </Box>
  );
};

export default LawFirmHeader;
