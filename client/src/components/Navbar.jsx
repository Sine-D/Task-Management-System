import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b border-white/[0.06]"
      style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-glow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-white font-display text-lg font-bold tracking-tight hidden sm:block">
            Issue<span className="text-violet-400">Track</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setDropOpen(p => !p)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/[0.07]"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/60 to-blue-600/60 border border-violet-500/30 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-white leading-tight">{user?.name}</p>
                <p className="text-[11px] text-dark-300 capitalize">{user?.role || 'Member'}</p>
              </div>
              <ChevronDown size={14} className={`text-dark-300 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {dropOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/[0.08] shadow-card overflow-hidden"
                style={{ background: 'rgba(18,18,26,0.98)', backdropFilter: 'blur(20px)' }}
              >
                <div className="p-1">
                  <button
                    onClick={() => { setDropOpen(false); logout(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
