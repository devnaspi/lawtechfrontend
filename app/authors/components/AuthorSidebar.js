'use client';

import React from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';

const AuthorSidebar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  const handleNavigation = (path) => {
    router.push(path);
  };

  // Function to check if the current path matches the button's path
  const isActive = (path) => pathname === path;

  return (
    <div style={{ width: '250px', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <List component="nav">
        <ListItem
          className='pointer'
          button
          onClick={() => handleNavigation('/authors/dashboard')}
          selected={isActive('/authors/dashboard')} // Highlight if the current path matches
        >
          <ListItemText primary="Dashboard" />
        </ListItem>
        <Divider />
        <ListItem
          className='pointer'
          button
          onClick={() => handleNavigation('/authors/create-article')}
          selected={isActive('/authors/create-article')}
        >
          <ListItemText primary="Create Article" />
        </ListItem>
        <ListItem
          className='pointer'
          button
          onClick={() => handleNavigation('/authors/manage-articles')}
          selected={isActive('/authors/manage-articles')}
        >
          <ListItemText primary="Manage Articles" />
        </ListItem>
        <ListItem
          className='pointer'
          button
          onClick={() => handleNavigation('/authors/profile')}
          selected={isActive('/authors/profile')}
        >
          <ListItemText primary="Manage Profile" />
        </ListItem>
      </List>
    </div>
  );
};

export default AuthorSidebar;
