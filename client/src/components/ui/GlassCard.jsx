import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = false, ...props }) {
  return (
    <motion.div
      className={`
        glass rounded-3xl border border-white/[0.06] shadow-card
        ${hover ? 'hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300' : ''}
        ${className}
      `}
      style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
