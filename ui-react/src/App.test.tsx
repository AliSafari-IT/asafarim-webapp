import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Asafarim', () => {
  render(<App />);
  // Check if DarkThemeToggle is rendered
  const darkThemeToggle = screen.getByTestId('dark-theme-toggle');
  expect(darkThemeToggle).toBeInTheDocument();

});


