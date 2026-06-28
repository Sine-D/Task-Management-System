import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Info, FileText } from 'lucide-react';
import CustomSelect from './CustomSelect';
import Button from './ui/Button';
import Input from './ui/Input';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, SEVERITY_OPTIONS } from '../constants/issueConstants';

const DEFAULT = { title: '', description: '', status: 'Open', priority: 'Medium', severity: 'Major' };

export default function IssueFormModal({ open, onClose, onSubmit, issue, isSubmitting }) {
  const [form, setForm] = useState(DEFAULT);
  const title = useMemo(() => (issue ? 'Edit Issue' : 'New Issue'), [issue]);

  useEffect(() => {
    setForm(issue
      ? { title: issue.title||'', description: issue.description||'', status: issue.status||'Open', priority: issue.priority||'Medium', severity: issue.severity||'Major' }
      : DEFAULT
    );
  }, [issue, open]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const ok = await onSubmit(form, issue?._id);
    if (ok) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ background: 'rgba(5,5,10,0.75)', backdropFilter: 'blur(12px)' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl border border-white/[0.09] shadow-glow-md flex flex-col max-h-[90vh] sm:max-h-[85vh]"
            style={{ background: 'rgba(14,14,20,0.98)', backdropFilter: 'blur(24px)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent z-10" />

            <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.06]">
              <div>
                <h2 className="text-xl font-display font-bold text-white tracking-tight">{title}</h2>
                <p className="text-xs text-dark-300 mt-0.5">Fill in the details to track this issue</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-dark-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5 overflow-y-auto max-h-full custom-scrollbar pb-6 flex-1">
              <Input
                label="Title"
                icon={Info}
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="What's the issue?"
                required
                minLength={3}
                maxLength={160}
              />

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-bold text-dark-200 uppercase tracking-wider ml-1">
                  <FileText size={12} className="text-violet-400" /> Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Steps to reproduce, expected vs actual behavior..."
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={5}
                  className="w-full bg-white/5 border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 placeholder-dark-300 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-dark-200 uppercase tracking-wider ml-1">Status</label>
                  <CustomSelect
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    options={STATUS_OPTIONS}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-dark-200 uppercase tracking-wider ml-1">Priority</label>
                  <CustomSelect
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    options={PRIORITY_OPTIONS}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-dark-200 uppercase tracking-wider ml-1">Severity</label>
                  <CustomSelect
                    name="severity"
                    value={form.severity}
                    onChange={handleChange}
                    options={SEVERITY_OPTIONS}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
                <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting} className="flex-1" icon={Save}>
                  {issue ? 'Save Changes' : 'Create Issue'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

