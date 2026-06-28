import clsx from 'clsx';
import { ChevronDown, ChevronUp, ChevronsUp, AlertCircle } from 'lucide-react';

const cfg = {
  Low:    { icon: ChevronDown,  label: 'Low',    color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
  Medium: { icon: ChevronUp,    label: 'Medium', color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/25' },
  High:   { icon: ChevronsUp,   label: 'High',   color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25' },
  Urgent: { icon: AlertCircle,  label: 'Urgent', color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/25' },
};

export default function PriorityBadge({ priority }) {
  const c = cfg[priority] || cfg.Medium;
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
      c.color, c.bg, c.border
    )}>
      <c.icon size={10} strokeWidth={3} />
      {c.label}
    </span>
  );
}
