import React from 'react';

export default function StatusBadge({ status }) {
  const getBadgeStyle = () => {
    switch (status) {
      case 'New':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'Contacted':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Closed':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)]';
    }
  };

  const getDotStyle = () => {
    switch (status) {
      case 'New':
        return 'bg-indigo-500';
      case 'Contacted':
        return 'bg-amber-500';
      case 'Closed':
        return 'bg-emerald-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-sm)] text-[11px] font-medium border font-mono ${getBadgeStyle()}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotStyle()}`}></span>
      <span>{status}</span>
    </span>
  );
}
