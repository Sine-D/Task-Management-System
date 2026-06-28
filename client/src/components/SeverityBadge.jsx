import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

const cfg = {
  Minor:    { label: 'Minor',    color: 'text-sky-400',     bg: 'bg-sky-500/10',     border: 'border-sky-500/25' },
  Major:    { label: 'Major',    color: 'text-indigo-400',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/25' },
  Critical: { label: 'Critical', color: 'text-pink-400',    bg: 'bg-pink-500/10',    border: 'border-pink-500/25' },
  Blocker:  { label: 'Blocker',  color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/25' },
};

export default function SeverityBadge({ severity }) {
  const c = cfg[severity] || cfg.Major;
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
      c.color, c.bg, c.border
    )}>
      <AlertCircle size={10} strokeWidth={3} />
      {c.label}
    </span>
  );
}
