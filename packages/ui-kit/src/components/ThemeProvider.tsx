import React from 'react';

type Theme = 'light' | 'dark';

interface ThemeProviderProps {
  defaultTheme?: Theme;
  color?: 'orange';
  children: React.ReactNode;
}

const ThemeContext = React.createContext<{ theme: Theme; setTheme: (t: Theme) => void } | null>(null);

export function ThemeProvider({ defaultTheme = 'light', color = 'orange', children }: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    const stored = window.localStorage.getItem('mb_theme');
    return (stored as Theme) || defaultTheme;
  });

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('mb_theme', t);
    }
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    // color theme
    root.classList.add('theme-orange');
    // dark/light
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}


