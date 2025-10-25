'use client';
import React from 'react';
import { useTheme } from '@/hooks/global/useTheme';
import { Button } from '../ui/button';
import { MoonStarIcon, SunIcon } from 'lucide-react';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="secondary" size="icon" onClick={toggleTheme}>
      {theme === 'light' ? (
        <SunIcon className="text-primary" />
      ) : (
        <MoonStarIcon className="text-primary" />
      )}
    </Button>
  );
};

export default ThemeSwitcher;
