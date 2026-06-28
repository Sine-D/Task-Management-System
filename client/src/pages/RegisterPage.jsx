import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Zap, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import GlassCard from '../components/ui/GlassCard';

const perks = [
  'Unlimited issue tracking',
  'Real-time team collaboration',
  'Advanced analytics dashboard',
  'Priority & severity management',
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.email = 'Only @gmail.com addresses are allowed';
    }

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!passRegex.test(formData.password)) {
      newErrors.password = 'Must include upper, lower, number and symbol';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerUser(formData);
      if (result.ok) navigate('/');
      else setError(result.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-violet-600/5 pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
          <GlassCard className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">Create account</h2>
              <p className="text-dark-300 mt-1.5 text-sm">Join thousands of teams shipping better software</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-5 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Full Name"
                icon={User}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                error={fieldErrors.name}
              />

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
                  placeholder="8+ chars, e.g. Pass123!"
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
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-dark-300">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
                Sign in →
              </Link>
            </p>
          </GlassCard>
        </motion.div>
      </div>

      {/* Right: Perks panel */}
      <div className="hidden lg:flex flex-col justify-start gap-24 w-[48%] relative overflow-hidden p-14">
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-600/20 via-transparent to-violet-600/15 pointer-events-none" />
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-glow-sm">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-white font-display text-xl font-bold tracking-tight">
            Issue<span className="text-violet-400">Track</span>
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative z-10 space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold text-white leading-tight tracking-tight">
              Everything you need<br />
              to <span className="gradient-text">ship with confidence</span>
            </h2>
            <p className="text-dark-200 text-base leading-relaxed max-w-xs">
              Start tracking, resolving and collaborating on issues in minutes — completely free.
            </p>
          </div>

          <div className="space-y-4">
            {perks.map((perk, i) => (
              <motion.div key={perk} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle size={12} className="text-violet-400" />
                </div>
                <span className="text-dark-100 text-sm font-medium">{perk}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

