'use client';

import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Header from './components/Header';

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleGenerarSolicitud = () => {
    router.push('/solicitud');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Header title="Solicitudes de tarjetas de crédito" />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button variant="outlined" sx={{ mr: 2 }}>
          Consultar Solicitud
        </Button>
        <Button variant="contained" onClick={handleGenerarSolicitud}>
          Generar Solicitud
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;