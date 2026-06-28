import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from './ui/Button';

export default function DeleteConfirmModal({ open, onClose, onConfirm, title, loading }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ background: 'rgba(5,5,10,0.8)', backdropFilter: 'blur(10px)' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] shadow-2xl"
            style={{ background: 'rgba(20,20,25,0.95)', backdropFilter: 'blur(20px)' }}
          >
            {/* Header Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/50 via-red-500 to-red-500/50" />
            
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative">
                  <AlertTriangle className="text-red-500" size={32} />
                  <div className="absolute inset-0 rounded-2xl bg-red-500/20 blur-xl animate-pulse" />
                </div>
              </div>

              <div className="text-center space-y-2 mb-8">
                <h3 className="text-2xl font-display font-bold text-white tracking-tight">
                  Delete Issue?
                </h3>
                <p className="text-dark-300 text-sm leading-relaxed">
                  Are you sure you want to delete <span className="text-white font-medium">"{title}"</span>? 
                  This action cannot be undone and all associated data will be permanently removed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1 order-2 sm:order-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  isLoading={loading}
                  className="flex-1 order-1 sm:order-2 bg-red-600 hover:bg-red-500 border-red-500/50 shadow-red-900/20 shadow-lg"
                >
                  Delete Permanently
                </Button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-dark-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <X size={18} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
