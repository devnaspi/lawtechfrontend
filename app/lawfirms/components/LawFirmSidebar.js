// app/lawfirms/components/LawFirmSidebar.js
'use client';

import React from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';

const LawFirmSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const isActive = (path) => pathname === path;

  return (
    <div style={{ width: '250px', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <List component="nav">
        <ListItem button className='pointer' onClick={() => handleNavigation('/lawfirms/dashboard')} selected={isActive('/lawfirms/dashboard')}>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <Divider />
        <ListItem button className='pointer' onClick={() => handleNavigation('/lawfirms/add-author')} selected={isActive('/lawfirms/add-author')}>
          <ListItemText primary="Add Author" />
        </ListItem>
        <ListItem button className='pointer' onClick={() => handleNavigation('/lawfirms/manage-authors')} selected={isActive('/lawfirms/manage-authors')}>
          <ListItemText primary="Manage Authors" />
        </ListItem>
        <ListItem button className='pointer' onClick={() => handleNavigation('/lawfirms/create-contract')} selected={isActive('/lawfirms/create-contract')}>
          <ListItemText primary="Create Contract" />
        </ListItem>
        <ListItem button className='pointer' onClick={() => handleNavigation('/lawfirms/manage-contracts')} selected={isActive('/lawfirms/manage-contracts')}>
          <ListItemText primary="Manage Contracts" />
        </ListItem>
        <ListItem button className='pointer' onClick={() => handleNavigation('/lawfirms/articles')} selected={isActive('/lawfirms/articles')}>
          <ListItemText primary="Articles" />
        </ListItem>
      </List>
    </div>
  );
};

export default LawFirmSidebar;
