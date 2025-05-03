'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#003366' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;