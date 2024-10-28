import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

function Navbar() {
  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{
        top: 0,
        left: 0,
        width: '100%',
        height: 100, // Ajusta la altura del Navbar
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Toolbar sx={{ minHeight: 100, width: '100%', justifyContent: 'center' }}>
        {/* Logo centrado en el Navbar */}
        <IconButton edge="center" color="inherit" aria-label="logo">
          <Box
            component="img"
            src={`${process.env.PUBLIC_URL}/logo.svg`}
            alt="Logo"
            sx={{ height: 100, width: 180 }} // Ajusta el tamaño según tus necesidades
          />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
