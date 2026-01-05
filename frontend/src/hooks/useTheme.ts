import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => {
        const stored = localStorage.getItem('deepblocks-theme');
        return (stored as Theme) || 'dark'; // 預設深色模式
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('deepblocks-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return { theme, toggleTheme, setTheme };
}
