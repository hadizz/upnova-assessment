import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function getInitialTheme(): boolean {
    if (typeof window === 'undefined') return false;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function Navbar() {
    const [isDark, setIsDark] = useState(getInitialTheme);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <nav className="bg-background border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <NavLink
                            to="/"
                            className="text-xl font-bold text-foreground tracking-tight"
                        >
                            Upnova Assessment
                        </NavLink>
                        <div className="hidden sm:flex gap-1">
                            <NavLink
                                to="/task-1"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-secondary text-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                    }`
                                }
                            >
                                Task 1
                            </NavLink>
                            <NavLink
                                to="/task-2"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-secondary text-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                    }`
                                }
                            >
                                Task 2
                            </NavLink>
                            <NavLink
                                to="/task-3"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-secondary text-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                    }`
                                }
                            >
                                Task 3
                            </NavLink>
                        </div>
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5 text-foreground" />
                        ) : (
                            <Moon className="w-5 h-5 text-foreground" />
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}
