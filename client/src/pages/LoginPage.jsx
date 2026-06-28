import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Zap, Shield, BarChart3, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import GlassCard from '../components/ui/GlassCard';

const features = [
  { icon: Zap, label: 'Real-time tracking', color: 'text-violet-400' },
  { icon: Shield, label: 'Secure & private', color: 'text-blue-400' },
  { icon: BarChart3, label: 'Powerful analytics', color: 'text-emerald-400' },
  { icon: CheckCircle, label: 'Team collaboration', color: 'text-amber-400' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors(p => {
        const n = { ...p };
        delete n[e.target.name];
        return n;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.email = 'Only @gmail.com addresses are allowed';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginUser(formData);
      if (result.ok) navigate('/');
      else setError(result.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex">
      {/* Left: Hero Panel */}
      <div className="hidden lg:flex flex-col justify-start gap-24 w-[52%] relative overflow-hidden p-14">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-blue-600/15 pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-white font-display text-xl font-bold">Issue<span className="text-violet-400">Track</span></span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative z-10 space-y-8">
          <div className="space-y-5">
            <h1 className="text-5xl font-display font-bold text-white leading-[1.1] tracking-tight">
              Track Issues.<br />
              <span className="gradient-text">Ship Faster.</span><br />
              Stay Ahead.
            </h1>
            <p className="text-dark-200 text-lg leading-relaxed max-w-sm">
              The modern issue tracking platform built for high-performing engineering teams.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <motion.div key={f.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center gap-2.5 glass rounded-xl px-4 py-3">
                <f.icon size={16} className={f.color} />
                <span className="text-sm font-medium text-dark-100">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-bl from-violet-600/5 via-transparent to-transparent pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
          {/* Mobile Branding Header */}
          <div className="flex lg:hidden flex-col items-center text-center mb-6 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-glow-sm">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-white font-display text-lg font-bold">Issue<span className="text-violet-400">Track</span></span>
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight leading-tight mt-1">
              Track Issues. <span className="gradient-text">Ship Faster.</span>
            </h1>
            <p className="text-dark-300 text-xs max-w-xs">
              The modern issue tracking platform built for high-performing engineering teams.
            </p>
          </div>

          <GlassCard className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">Welcome back</h2>
              <p className="text-dark-300 mt-1.5 text-sm">Sign in to your workspace</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-5 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                label="Email"
                icon={Mail}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@gmail.com"
                error={fieldErrors.email}
              />

              <div className="relative">
                <Input
                  label="Password"
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  error={fieldErrors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-[38px] text-dark-300 hover:text-dark-100 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full" icon={ArrowRight}>
                Sign In
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-dark-300">
              No account?{' '}
              <Link to="/register" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
                Create one free →
              </Link>
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

