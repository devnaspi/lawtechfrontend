'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Button, Box } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { useSnackbar } from 'notistack';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import { useAuth } from '@/context/AuthContext';

const LawFirmSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { enqueueSnackbar } = useSnackbar();
  const { handleApiError } = useApiErrorHandler();
  const { logout } = useAuth();
  
  const [selectedTab, setSelectedTab] = useState(0);

  const routes = ['/lawfirms/dashboard', '/lawfirms/add-author', '/lawfirms/manage-authors', '/lawfirms/articles'];

  useEffect(() => {
    const currentRoute = routes.indexOf(pathname);
    if (currentRoute !== -1) {
      setSelectedTab(currentRoute);
    }
  }, [pathname]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    router.push(routes[newValue]);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/users/auth/logout/');
      logout();
      enqueueSnackbar('Logout successful!', { variant: 'success' });
      router.push('/lawfirms/signin');
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      backgroundColor: '#f5f5f5',
      borderColor: 'divider',
      pt: 3,
    }}>
      {/* Sidebar Navigation */}
      <Tabs
        orientation="vertical"
        value={selectedTab}
        onChange={handleTabChange}
        sx={{
          width: '100%',
          flexGrow: 1,
          '& .MuiTab-root': {
            textAlign: 'left',
            color: 'info.main',
          },
          '& .Mui-selected': {
            color: 'info.main',
            borderLeft: '4px solid',
            borderColor: 'info.main',
          },
        }}
      >
        <Tab label="Dashboard" />
        <Tab label="Add Author" />
        <Tab label="Manage Authors" />
        <Tab label="Articles" />
      </Tabs>

      {/* Logout Button */}
      <Button
        color="error"
        variant="text"
        size="small"
        sx={{ m: 2 }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default LawFirmSidebar;
