import './LandingPage.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import LandingPage from './LandingPage';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <MantineProvider>
    <LandingPage />
  </MantineProvider>
);

