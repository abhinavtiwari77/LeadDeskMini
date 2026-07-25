import React from 'react';

export function StatSkeleton() {
  return (
    <div className="card-flat p-4 animate-pulse">
      <div className="h-3 w-20 bg-[var(--border-subtle)] rounded mb-3"></div>
      <div className="h-7 w-14 bg-[var(--border-strong)] rounded mb-1"></div>
      <div className="h-2.5 w-28 bg-[var(--border-subtle)] rounded"></div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-[var(--border-subtle)]">
      <td className="py-3.5 px-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--border-subtle)] shrink-0"></div>
          <div>
            <div className="h-3.5 w-28 bg-[var(--border-strong)] rounded mb-1"></div>
            <div className="h-2.5 w-36 bg-[var(--border-subtle)] rounded"></div>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-5">
        <div className="h-4 w-16 bg-[var(--border-subtle)] rounded-full"></div>
      </td>
      <td className="py-3.5 px-5">
        <div className="h-3 w-20 bg-[var(--border-subtle)] rounded"></div>
      </td>
      <td className="py-3.5 px-5">
        <div className="h-3 w-40 bg-[var(--border-subtle)] rounded"></div>
      </td>
      <td className="py-3.5 px-5 text-right">
        <div className="h-7 w-24 bg-[var(--border-subtle)] rounded-[var(--radius-sm)] ml-auto"></div>
      </td>
    </tr>
  );
}
