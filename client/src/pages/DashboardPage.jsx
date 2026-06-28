import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RefreshCw, LayoutGrid, List, Search, AlertCircle, Download } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  fetchIssues, fetchStats, setViewMode, setFilters, 
  addIssue, patchIssue, patchStatus, removeIssue, clearError
} from '../store/slices/issueSlice';
import IssueCard from '../components/IssueCard';
import IssueFilters from '../components/IssueFilters';
import IssueFormModal from '../components/IssueFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Pagination from '../components/Pagination';
import StatsCards from '../components/StatsCards';
import Navbar from '../components/Navbar';
import useDebounce from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items: issues, summary, pagination, loading: isLoading, submitting: isSubmitting, error: reduxError, filters, viewMode } = useSelector(state => state.issues);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueToDelete, setIssueToDelete] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 450);

  const params = useMemo(() => ({
    q: debouncedSearch, status: filters.status, priority: filters.priority,
    severity: filters.severity, page: filters.page, limit: filters.limit,
  }), [debouncedSearch, filters.status, filters.priority, filters.severity, filters.page, filters.limit]);

  const loadDashboard = useCallback(() => {
    dispatch(fetchIssues(params));
    dispatch(fetchStats());
  }, [dispatch, params]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const handleRefresh = async () => {
    setSpinning(true);
    loadDashboard();
    setTimeout(() => setSpinning(false), 600);
  };

  const handleCreate = () => { setSelectedIssue(null); setIsModalOpen(true); };
  const handleEdit = (issue) => { setSelectedIssue(issue); setIsModalOpen(true); };

  const handleSubmit = async (payload, id) => {
    try {
      if (id) {
        await dispatch(patchIssue({ id, payload })).unwrap();
        toast.success('Issue updated successfully');
      } else {
        await dispatch(addIssue(payload)).unwrap();
        toast.success('Issue created successfully');
      }
      loadDashboard();
      return true;
    } catch (e) {
      toast.error(e || 'Failed to save');
      return false;
    }
  };

  const handleStatus = async (issue, status) => {
    try {
      await dispatch(patchStatus({ id: issue._id, status })).unwrap();
      toast.success(`Issue ${status.toLowerCase()}`);
      loadDashboard();
    } catch (e) {
      toast.error(e || 'Failed to update status');
    }
  };

  const handleDelete = (issue) => {
    setIssueToDelete(issue);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!issueToDelete) return;
    setDeleting(true);
    try {
      await dispatch(removeIssue(issueToDelete._id)).unwrap();
      toast.success('Issue deleted');
      setIsDeleteModalOpen(false);
      loadDashboard();
    } catch (e) {
      toast.error(e || 'Failed to delete');
    } finally {
      setDeleting(false);
      setIssueToDelete(null);
    }
  };

  const handleExportCSV = () => {
    if (!issues.length) return;
    
    const headers = ['ID', 'Title', 'Status', 'Priority', 'Severity', 'Description', 'Created At', 'Resolved At'];
    const rows = issues.map(i => [
      i._id,
      `"${i.title.replace(/"/g, '""')}"`,
      i.status,
      i.priority,
      i.severity,
      `"${(i.description || '').replace(/"/g, '""')}"`,
      new Date(i.createdAt).toLocaleString(),
      i.resolvedAt ? new Date(i.resolvedAt).toLocaleString() : '-'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `issues_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* Greeting */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-dark-900 bg-grid">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-5"
        >
          <div>
            <p className="text-xs font-semibold text-dark-300 uppercase tracking-widest mb-1">
              {greeting}, {firstName} 👋
            </p>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">
              Issue Dashboard
            </h1>
            <p className="text-dark-300 text-sm mt-1">Monitor, track and resolve your project issues</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className="p-2.5 rounded-xl border border-white/[0.08] text-dark-200 hover:text-white
                         hover:border-white/20 hover:bg-white/5 transition-all active:scale-95"
              title="Refresh"
            >
              <RefreshCw size={17} className={spinning ? 'animate-spin' : ''} />
            </button>

            {/* View toggle */}
            <div className="flex p-1 rounded-xl border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <button
                onClick={() => dispatch(setViewMode('grid'))}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-dark-300 hover:text-dark-100'}`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => dispatch(setViewMode('list'))}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-dark-300 hover:text-dark-100'}`}
              >
                <List size={15} />
              </button>
            </div>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              disabled={!issues.length}
              className="p-2.5 rounded-xl border border-white/[0.08] text-dark-200 hover:text-white
                         hover:border-white/20 hover:bg-white/5 transition-all active:scale-95 disabled:opacity-30"
              title="Export to CSV"
            >
              <Download size={17} />
            </button>

            {/* New Issue */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                         bg-gradient-to-r from-violet-600 to-blue-600
                         hover:from-violet-500 hover:to-blue-500
                         text-white font-semibold text-sm
                         shadow-glow-sm transition-all"
            >
              <Plus size={17} />
              New Issue
            </motion.button>
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <StatsCards summary={summary} />

        {/* ── Filter bar ── */}
        <div className="rounded-2xl border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.025)' }}>
          <IssueFilters filters={filters} />
        </div>



        {/* ── Issues ── */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin" />
              <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-lg" />
            </div>
            <p className="text-dark-300 text-sm font-medium">Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/[0.07] flex items-center justify-center mb-6">
              <Search size={32} className="text-dark-300" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">No issues found</h3>
            <p className="text-dark-300 text-sm mt-2 max-w-sm">
              Try adjusting your filters, or create your first issue to get started.
            </p>
            <button
              onClick={handleCreate}
              className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl
                         bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm
                         hover:from-violet-500 hover:to-blue-500 shadow-glow-sm transition-all"
            >
              <Plus size={18} /> Create Issue
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'flex flex-col gap-3'
            }
          >
            {issues.map(issue => (
              <motion.div key={issue._id} variants={item}>
                <IssueCard
                  issue={issue}
                  onEdit={handleEdit}
                  onResolve={i => handleStatus(i, 'Resolved')}
                  onClose={i => handleStatus(i, 'Closed')}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Pagination ── */}
        {!isLoading && issues.length > 0 && (
          <Pagination pagination={pagination} onPageChange={p => dispatch(setFilters({ page: p }))} />
        )}
      </main>

      <IssueFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        issue={selectedIssue}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={issueToDelete?.title}
        loading={deleting}
      />
    </div>
  );
}
