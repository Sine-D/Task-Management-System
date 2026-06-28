import { motion } from 'framer-motion';
import { CircleDot, Clock, CheckCircle2, XCircle } from 'lucide-react';

const cardConfig = [
  {
    key: 'Open',
    icon: CircleDot,
    label: 'Open Issues',
    color: 'text-blue-400',
    bg: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20',
    glow: 'shadow-blue-500/10',
    dot: 'bg-blue-400',
  },
  {
    key: 'In Progress',
    icon: Clock,
    label: 'In Progress',
    color: 'text-amber-400',
    bg: 'from-amber-500/10 to-amber-600/5',
    border: 'border-amber-500/20',
    glow: 'shadow-amber-500/10',
    dot: 'bg-amber-400',
  },
  {
    key: 'Resolved',
    icon: CheckCircle2,
    label: 'Resolved',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-500/20',
    glow: 'shadow-emerald-500/10',
    dot: 'bg-emerald-400',
  },
  {
    key: 'Closed',
    icon: XCircle,
    label: 'Closed',
    color: 'text-dark-200',
    bg: 'from-white/5 to-white/[0.02]',
    border: 'border-white/10',
    glow: 'shadow-white/5',
    dot: 'bg-dark-300',
  },
];

export default function StatsCards({ summary }) {
  const total = Object.values(summary).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cardConfig.map((item, i) => {
        const count = summary[item.key] || 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ y: -3, scale: 1.01 }}
            className={`relative overflow-hidden rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg}
                        shadow-lg ${item.glow} p-5 cursor-default transition-all duration-300`}
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            {/* Ambient glow blob */}
            <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${item.dot} opacity-10 blur-2xl`} />

            <div className="relative z-10 flex flex-col gap-4">
              {/* Top row */}
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}
                                bg-gradient-to-br ${item.bg} border ${item.border}`}>
                  <item.icon size={18} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.dot} ${count > 0 ? 'animate-pulse' : ''}`} />
                  <span className="text-[10px] font-bold text-dark-300 uppercase tracking-wider">{pct}%</span>
                </div>
              </div>

              {/* Count */}
              <div>
                <p className="text-4xl font-display font-bold text-white tracking-tight">{count}</p>
                <p className="text-xs font-medium text-dark-300 mt-1">{item.label}</p>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.7, ease: 'easeOut' }}
                  className={`h-full rounded-full ${item.dot}`}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
