import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-app)] py-6 text-xs text-[var(--text-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-sans text-[11px]">
          &copy; {new Date().getFullYear()} LeadDesk Mini. All rights reserved.
        </p>

        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-all font-medium text-[11px]"
        >
          <span>Built for Digital Heroes Training Task</span>
          <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
        </a>
      </div>
    </footer>
  );
}
