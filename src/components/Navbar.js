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
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        paddingX: '20px',  // Aplica un padding horizontal para alinear con el contenido
      }}
    >
      <Toolbar sx={{ minHeight: 100, width: 'calc(100% - 40px)', justifyContent: 'center' }}>
        {/* Logo centrado en el Navbar */}
        <IconButton color="inherit" aria-label="logo">
          <Box
            component="img"
            src={`${process.env.PUBLIC_URL}/logo.svg`}
            alt="Logo"
            sx={{ height: 100, width: 180 }}
          />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
