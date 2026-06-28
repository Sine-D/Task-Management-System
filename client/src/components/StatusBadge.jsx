import clsx from 'clsx';
import { Circle, Clock, CheckCircle2, XCircle } from 'lucide-react';

const statusConfig = {
  Open:         { icon: Circle,       label: 'Open',        color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/25' },
  'In Progress':{ icon: Clock,        label: 'In Progress', color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25' },
  Resolved:     { icon: CheckCircle2, label: 'Resolved',    color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
  Closed:       { icon: XCircle,      label: 'Closed',      color: 'text-dark-200',    bg: 'bg-white/5',        border: 'border-white/10' },
};

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Open;
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
      cfg.color, cfg.bg, cfg.border
    )}>
      <cfg.icon size={10} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}
