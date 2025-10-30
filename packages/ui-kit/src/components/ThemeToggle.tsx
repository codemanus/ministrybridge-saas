import React from 'react';
import { useTheme } from './ThemeProvider.js';
import { Button } from '../primitives/Button.js';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <Button variant="outline" onClick={() => setTheme(next)}>
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </Button>
  );
}


