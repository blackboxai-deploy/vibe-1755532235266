'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="h-8 w-8 p-0"
    >
      <div className="h-4 w-4">
        {theme === 'dark' ? (
          <div className="h-4 w-4 rounded-full bg-yellow-500" />
        ) : (
          <div className="h-4 w-4 rounded-full border-2 border-gray-700" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}