'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

const THEMES = [
  { key: 'light', icon: Sun, label: 'Light' },
  { key: 'dark', icon: Moon, label: 'Dark' },
  { key: 'system', icon: Monitor, label: 'System' },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-44" aria-hidden="true" />;
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/70 p-1">
      {THEMES.map((item) => {
        const Icon = item.icon;
        const active = theme === item.key;
        return (
          <Button
            key={item.key}
            type="button"
            size="sm"
            variant={active ? 'default' : 'ghost'}
            onClick={() => setTheme(item.key)}
            className="h-7 gap-1 px-2"
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{item.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
