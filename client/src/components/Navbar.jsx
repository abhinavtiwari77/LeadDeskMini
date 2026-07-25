import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Globe, LayoutDashboard, ShieldCheck, LogOut, Sun, Moon, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const handleLogout = async () => {
    await logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const isLandingActive = location.pathname === '/';
  const isDashboardActive = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-app)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] relative">
      {/* Left-anchored logo (flush to viewport edge) */}
      <Link
        to="/"
        className="absolute left-0 sm:left-0 lg:left-0 top-1/2 transform -translate-y-1/2 flex items-center gap-2 pl-3 sm:pl-4 lg:pl-6 group"
      >
        <div className="w-5 h-5 rounded-[4px] text-[var(--accent)] flex items-center justify-center font-bold">
          <Layers className="w-5 h-5 stroke-2 stroke-current fill-none" />
        </div>
        <span className="font-display font-bold text-sm sm:text-base tracking-tight text-[var(--text-primary)]">
          LeadDesk
        </span>
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-center">

        {/* Zone 2: Navigation Links & Utility Actions */}
        <nav className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center gap-4 pr-3 sm:pr-4 lg:pr-6">
          {/* Primary Nav Links Subgroup */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all duration-150 ${
                isLandingActive
                  ? 'bg-[var(--accent)]/8 text-[var(--accent)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
              }`}
            >
              <Globe className="w-4 h-4 flex-shrink-0" />
              <span>Landing</span>
            </Link>

            {isAuthenticated ? (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all duration-150 ${
                  isDashboardActive
                    ? 'bg-[var(--accent)]/8 text-[var(--accent)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all duration-150 ${
                  location.pathname === '/login'
                    ? 'bg-[var(--accent)]/8 text-[var(--accent)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>Admin Portal</span>
              </Link>
            )}
          </div>

          {/* Visual Divider between Primary Nav Links and Utility Icons */}
          <div className="h-4 w-px bg-[var(--border-subtle)]" />

          {/* Utility Icons Subgroup */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle Icon Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all duration-150 cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Logout Action (when authenticated) */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all duration-150 cursor-pointer"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
