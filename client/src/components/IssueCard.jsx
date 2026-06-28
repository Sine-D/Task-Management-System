import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Edit2, CheckCircle2, XCircle, Trash2, Calendar, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import SeverityBadge from './SeverityBadge';
import { formatDateTime } from '../utils/format';
import { ISSUE_STATUS } from '../constants/issueConstants';

export default function IssueCard({ issue, onResolve, onClose, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-2xl border border-white/[0.07] p-5 transition-all duration-300 hover:border-white/[0.12] hover:shadow-card-hover overflow-hidden cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.025)' }}
    >
      {/* Hover shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Badge row */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={issue.status} />
          <PriorityBadge priority={issue.priority} />
          <SeverityBadge severity={issue.severity} />
        </div>

        {/* Title */}
        <div>
          <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors duration-200 line-clamp-1">
            {issue.title}
          </h3>
          <p className="text-xs text-dark-300 mt-1.5 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-1 text-[11px] text-dark-300">
            <Clock size={11} />
            {formatDateTime(issue.updatedAt)}
          </div>
          <Link
            to={`/issues/${issue._id}`}
            className="flex items-center gap-1 text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View <ArrowRight size={11} />
          </Link>
        </div>

        {/* Action bar — shown on hover on desktop, always visible on mobile */}
        <div className="flex items-center gap-1.5 pt-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 -mb-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(issue); }}
            className="p-1.5 rounded-lg text-dark-200 hover:text-white hover:bg-white/10 transition-all"
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          {issue.status !== ISSUE_STATUS.RESOLVED && (
            <button
              onClick={(e) => { e.stopPropagation(); onResolve(issue); }}
              className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all"
              title="Resolve"
            >
              <CheckCircle2 size={13} />
            </button>
          )}
          {issue.status !== ISSUE_STATUS.CLOSED && (
            <button
              onClick={(e) => { e.stopPropagation(); onClose(issue); }}
              className="p-1.5 rounded-lg text-dark-200 hover:text-white hover:bg-white/10 transition-all"
              title="Close"
            >
              <XCircle size={13} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(issue); }}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all ml-auto"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
