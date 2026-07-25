import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  RefreshCw,
  Inbox,
  ChevronDown,
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { StatSkeleton, TableRowSkeleton } from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';

export default function DashboardPage() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Confirmation Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    leadId: null,
    leadName: '',
    targetStatus: '',
    currentStatus: '',
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { addToast } = useToast();

  // Search Debounce Handler (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch leads function
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await api.get('/leads', { params });
      if (res.data?.success) {
        setLeads(res.data.data || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch leads from MongoDB', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, addToast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Open status confirmation dialog
  const promptStatusChange = (leadId, leadName, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;
    setModalState({
      isOpen: true,
      leadId,
      leadName,
      targetStatus: newStatus,
      currentStatus,
    });
  };

  // Confirm status update handler
  const handleConfirmStatusChange = async () => {
    const { leadId, targetStatus, leadName } = modalState;
    setIsUpdatingStatus(true);
    try {
      const res = await api.patch(`/leads/${leadId}/status`, { status: targetStatus });
      if (res.data?.success) {
        addToast(`Status for "${leadName}" updated to '${targetStatus}'`, 'success');
        // Optimistic UI update
        setLeads((prev) =>
          prev.map((l) => (l._id === leadId ? { ...l, status: targetStatus } : l))
        );
        fetchLeads();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
    } finally {
      setIsUpdatingStatus(false);
      setModalState({ isOpen: false, leadId: null, leadName: '', targetStatus: '', currentStatus: '' });
    }
  };

  // Helper for avatar initials
  const getInitials = (name) => {
    if (!name) return 'LD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Admin Lead Desk
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Real-time MongoDB lead capture pipeline, search, and status triage.
          </p>
        </div>

        <button
          onClick={fetchLeads}
          disabled={loading}
          className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* METRIC CARDS (Clean typography & Geist Mono numbers - No Icon-in-colored-square) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading && leads.length === 0 ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <div className="card-flat p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-[var(--text-muted)]">Total Inbound</span>
              <div className="mt-2">
                <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] block">
                  {stats.total}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">All captured leads</span>
              </div>
            </div>

            <div className="card-flat p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-[var(--text-muted)]">New Leads</span>
              <div className="mt-2">
                <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[var(--accent)] block">
                  {stats.new}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">Awaiting outreach</span>
              </div>
            </div>

            <div className="card-flat p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-[var(--text-muted)]">Contacted</span>
              <div className="mt-2">
                <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-amber-500 block">
                  {stats.contacted}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">In conversation</span>
              </div>
            </div>

            <div className="card-flat p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-[var(--text-muted)]">Closed Deals</span>
              <div className="mt-2">
                <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-emerald-500 block">
                  {stats.closed}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">Successfully converted</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="card-flat p-3 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Debounced Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-12 py-1.5 text-xs input-field"
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1.5 text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] px-1 rounded"
            >
              Clear
            </button>
          ) : (
            <span className="absolute right-2.5 top-2 text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)] px-1 rounded pointer-events-none">
              ⌘K
            </span>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'New', 'Contacted', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-[var(--radius-sm)] text-xs font-medium transition-all ${
                statusFilter === st
                  ? 'btn-primary shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="card-flat overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-medium text-[11px]">
              <tr>
                <th className="py-3 px-5">Lead Contact</th>
                <th className="py-3 px-5">Budget Tier</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Message Snippet</th>
                <th className="py-3 px-5 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] mb-3">
                        <Inbox className="w-5 h-5" />
                      </div>
                      <h3 className="font-display text-sm font-semibold text-[var(--text-primary)]">No Leads Found</h3>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {searchTerm || statusFilter !== 'All'
                          ? 'No lead matches your search query or status filter.'
                          : 'No inbound leads submitted yet. Submit a test lead from the landing page!'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-[var(--bg-surface-elevated)]/60 transition-colors">
                    {/* Contact Details with Avatar Badge */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-mono text-[11px] font-bold text-[var(--text-primary)] shrink-0">
                          {getInitials(lead.name)}
                        </div>
                        <div>
                          <div className="font-medium text-[var(--text-primary)] text-xs sm:text-sm">{lead.name}</div>
                          <div className="text-[var(--text-muted)] font-mono text-[11px] mt-0.5">{lead.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Budget Tier */}
                    <td className="py-3.5 px-5 font-mono text-[11px] text-[var(--text-secondary)]">
                      <span className="px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                        {lead.budget}
                      </span>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-3.5 px-5 font-mono text-[11px] text-[var(--text-muted)]">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Message */}
                    <td className="py-3.5 px-5 max-w-xs">
                      <p className="truncate text-[var(--text-secondary)] text-xs" title={lead.message}>
                        {lead.message}
                      </p>
                    </td>

                    {/* Status Action Dropdown */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="relative inline-block text-left">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            promptStatusChange(lead._id, lead.name, lead.status, e.target.value)
                          }
                          className="appearance-none bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-2.5 py-1 pr-7 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] cursor-pointer transition-all"
                        >
                          <option value="New">Status: New</option>
                          <option value="Contacted">Status: Contacted</option>
                          <option value="Closed">Status: Closed</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-[var(--text-muted)] absolute right-2 top-2 pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        title="Update Lead Status?"
        message={`Are you sure you want to change status for "${modalState.leadName}" from '${modalState.currentStatus}' to '${modalState.targetStatus}'? This will update MongoDB immediately.`}
        confirmText="Update Status"
        cancelText="Cancel"
        isSubmitting={isUpdatingStatus}
        onConfirm={handleConfirmStatusChange}
        onCancel={() =>
          setModalState({ isOpen: false, leadId: null, leadName: '', targetStatus: '', currentStatus: '' })
        }
      />
    </div>
  );
}
