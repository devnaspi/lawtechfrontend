'use client';

import React, { useEffect, useState } from 'react';
import { Box, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { Dashboard, Description, AddBox, History, Logout } from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
import { useSnackbar } from 'notistack';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import { useAuth } from '@/context/AuthContext';

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { enqueueSnackbar } = useSnackbar();
  const { handleApiError } = useApiErrorHandler();
  const { logout } = useAuth();

  const routes = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/admin/contracts/create', label: 'Create Contract', icon: <AddBox /> },
    { path: '/admin/contracts', label: 'Manage Contracts', icon: <Description /> },
    { path: '/admin/activity/logs', label: 'Activity Logs', icon: <History /> },
  ];

  const [activeRoute, setActiveRoute] = useState('');

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname]);

  const handleNavigation = (path) => {
    setActiveRoute(path);
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/users/auth/logout/');
      logout();
      enqueueSnackbar('Logout successful!', { variant: 'success' });
      router.push('/admin/signin');
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <Box 
      sx={{ 
        width: 250, 
        height: '100vh', 
        backgroundColor: '#1E1E1E', 
        color: '#fff', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between' 
      }}
    >
      {/* Top: Logo and Navigation */}
      <Box>
        {/* Logo / Brand */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
          <img src="/logo.svg" alt="Praelex Logo" style={{ height: 32, marginRight: 8 }} />
          <Typography variant="h6" fontWeight="bold" color="white">Praelex</Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Navigation */}
        <Box>
          {routes.map((route, index) => (
            <ListItemButton
              key={index}
              onClick={() => handleNavigation(route.path)}
              sx={{
                color: '#fff',
                backgroundColor: activeRoute === route.path ? '#2A2A2A' : 'transparent',
                '&:hover': { backgroundColor: '#333' },
                px: 3,
              }}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>
                {route.icon}
              </ListItemIcon>
              <ListItemText primary={route.label} />
            </ListItemButton>
          ))}
        </Box>
      </Box>

      {/* Bottom: Logout */}
      <Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <ListItemButton onClick={handleLogout} sx={{ color: '#fff', px: 3, py: 2 }}>
          <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default AdminSidebar;
