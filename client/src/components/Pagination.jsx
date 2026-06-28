import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, total, limit } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 rounded-2xl border border-white/[0.07]"
         style={{ background: 'rgba(255,255,255,0.025)' }}>
      <p className="text-xs text-dark-300 font-medium">
        Showing <span className="text-white font-bold">{from}–{to}</span> of{' '}
        <span className="text-white font-bold">{total}</span> issues
      </p>

      <div className="flex items-center gap-3">
        <span className="text-[11px] text-dark-300 font-semibold uppercase tracking-wider">
          Page <span className="text-white">{page}</span> / {totalPages}
        </span>

        <div className="flex gap-1.5">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-2 rounded-xl border border-white/[0.08] text-dark-200 hover:text-white
                       hover:border-white/20 hover:bg-white/5 disabled:opacity-30
                       disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-2 rounded-xl border border-white/[0.08] text-dark-200 hover:text-white
                       hover:border-white/20 hover:bg-white/5 disabled:opacity-30
                       disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
