import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, KeyRound, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const fillDemoCredentials = () => {
    setValue('email', 'admin@leaddesk.com');
    setValue('password', 'Admin@123456');
    setCopied(true);
    addToast('Demo credentials auto-filled', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await login(data.email, data.password);
      if (res.success) {
        addToast('Welcome back, Admin!', 'success');
        navigate('/admin');
      }
    } catch (err) {
      const errorMsg = err.message || 'Invalid email or password';
      addToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        {/* DEMO CREDENTIALS BANNER */}
        <div className="mb-4 p-3 rounded-[var(--radius-md)] card-flat text-xs flex items-center justify-between gap-3">
          <div>
            <span className="font-medium text-[var(--text-secondary)] block text-[11px] mb-0.5">
              Demo Credentials:
            </span>
            <code className="text-[var(--text-primary)] font-mono text-[11px]">
              admin@leaddesk.com / Admin@123456
            </code>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--accent-light)] hover:bg-[var(--accent)] text-[var(--accent)] hover:text-white border border-[var(--accent-border)] text-[11px] font-mono font-medium shrink-0 flex items-center gap-1 transition-all"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>Auto-fill</span>
          </button>
        </div>

        {/* LOGIN CARD */}
        <div className="card-elevated p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--accent-light)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)] mx-auto mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)] tracking-tight">
              Admin Access
            </h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Sign in with your admin account to manage lead pipeline.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="admin@leaddesk.com"
                  {...register('email')}
                  className={`w-full pl-9 pr-3 py-2 text-xs input-field ${
                    errors.email ? 'border-rose-500' : ''
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-rose-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-9 pr-3 py-2 text-xs input-field ${
                    errors.password ? 'border-rose-500' : ''
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-rose-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 btn-primary text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
