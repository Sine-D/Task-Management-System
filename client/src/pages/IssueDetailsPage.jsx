import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Edit2, Calendar, Hash, Clock, CheckCircle2, Plus, ArrowLeft } from 'lucide-react';
import { getIssueById, updateIssue } from '../api/issueApi';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import SeverityBadge from '../components/SeverityBadge';
import IssueFormModal from '../components/IssueFormModal';
import Navbar from '../components/Navbar';
import { formatDateTime } from '../utils/format';

const MetaRow = ({ label, children }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
    <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider">{label}</span>
    <div>{children}</div>
  </div>
);

const TimelineItem = ({ icon: Icon, label, time, color }) => (
  <div className="flex items-start gap-3">
    <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={13} />
    </div>
    <div>
      <p className="text-sm font-semibold text-white">{label}</p>
      {time ? (
        <p className="text-xs text-dark-300 mt-0.5">{time}</p>
      ) : (
        <p className="text-xs text-dark-400 mt-0.5 italic">Not yet</p>
      )}
    </div>
  </div>
);

export default function IssueDetailsPage() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try { const d = await getIssueById(id); setIssue(d.issue); setError(''); }
    catch (e) { setError(e?.response?.data?.message || 'Unable to load issue'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const handleUpdate = async (payload) => {
    try { setIsSubmitting(true); await updateIssue(id, payload); await load(); return true; }
    catch (e) { setError(e?.response?.data?.message || 'Update failed'); return false; }
    finally { setIsSubmitting(false); }
  };

  /* ── Loading ── */
  if (isLoading) return (
    <div className="min-h-screen bg-dark-900 bg-grid">
      <Navbar />
      <div className="flex justify-center items-center py-40">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin" />
            <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-lg" />
          </div>
          <p className="text-dark-300 text-sm font-medium">Loading issue...</p>
        </div>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error && !issue) return (
    <div className="min-h-screen bg-dark-900 bg-grid">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-5">
          <Hash size={28} className="text-rose-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Issue Not Found</h2>
        <p className="text-dark-300 text-sm mb-8">{error}</p>
        <Link to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                     bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-sm
                     hover:from-violet-500 hover:to-blue-500 shadow-glow-sm transition-all"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 bg-grid">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-dark-300 mb-8">
          <Link to="/" className="hover:text-violet-400 transition-colors flex items-center gap-1">
            <ArrowLeft size={13} /> Dashboard
          </Link>
          <ChevronRight size={12} className="text-dark-400" />
          <span className="text-dark-100 truncate max-w-[280px]">{issue.title}</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* ── Hero card ── */}
          <div
            className="relative rounded-3xl border border-white/[0.08] overflow-hidden p-8"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/8 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10">
              {/* Badge row */}
              <div className="flex flex-wrap gap-2 mb-5">
                <StatusBadge status={issue.status} />
                <PriorityBadge priority={issue.priority} />
                <SeverityBadge severity={issue.severity} />
              </div>

              {/* Title + Edit button */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-display font-bold text-white tracking-tight leading-snug">
                    {issue.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-medium text-dark-300">
                    <span className="flex items-center gap-1.5"><Hash size={12} />{issue._id.slice(-8).toUpperCase()}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={12} />Created {formatDateTime(issue.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl
                             bg-white/5 border border-white/[0.09] text-white text-sm font-semibold
                             hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
                >
                  <Edit2 size={15} /> Edit Issue
                </button>
              </div>
            </div>
          </div>

          {/* ── Two-column layout ── */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Description */}
            <div
              className="lg:col-span-2 rounded-2xl border border-white/[0.07] p-6"
              style={{ background: 'rgba(255,255,255,0.025)' }}
            >
              <h2 className="text-xs font-bold text-dark-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1 h-3 rounded-full bg-violet-500" /> Description
              </h2>
              <p className="text-dark-100 text-sm leading-7 whitespace-pre-wrap">
                {issue.description}
              </p>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Meta */}
              <div
                className="rounded-2xl border border-white/[0.07] p-5"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <h2 className="text-xs font-bold text-dark-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1 h-3 rounded-full bg-blue-500" /> Details
                </h2>
                <MetaRow label="Status"><StatusBadge status={issue.status} /></MetaRow>
                <MetaRow label="Priority"><PriorityBadge priority={issue.priority} /></MetaRow>
                <MetaRow label="Severity"><SeverityBadge severity={issue.severity} /></MetaRow>
                {issue.createdBy?.name && (
                  <MetaRow label="Created By">
                    <span className="text-xs text-white font-semibold">{issue.createdBy.name}</span>
                  </MetaRow>
                )}
                <MetaRow label="Issue ID">
                  <code className="text-[10px] font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">
                    {issue._id.slice(-10).toUpperCase()}
                  </code>
                </MetaRow>
              </div>

              {/* Timeline */}
              <div
                className="rounded-2xl border border-white/[0.07] p-5 space-y-4"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <h2 className="text-xs font-bold text-dark-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-3 rounded-full bg-emerald-500" /> Timeline
                </h2>
                <TimelineItem
                  icon={Plus}
                  label="Created"
                  time={formatDateTime(issue.createdAt)}
                  color="bg-blue-500/15 text-blue-400"
                />
                <TimelineItem
                  icon={Clock}
                  label="Last Updated"
                  time={formatDateTime(issue.updatedAt)}
                  color="bg-dark-500 text-dark-200"
                />
                <TimelineItem
                  icon={CheckCircle2}
                  label="Resolved"
                  time={issue.resolvedAt ? formatDateTime(issue.resolvedAt) : null}
                  color={issue.resolvedAt ? "bg-emerald-500/15 text-emerald-400" : "bg-dark-500 text-dark-400"}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <IssueFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdate}
        issue={issue}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
