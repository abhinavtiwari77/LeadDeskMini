import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Send,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../components/Toast';

// Form validation schema matching exact server rules
const leadFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  budget: z.enum(['< $500', '$500-$1000', '$1000-$5000', '> $5000'], {
    errorMap: () => ({ message: 'Please select a valid budget range' }),
  }),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters long'),
});

export default function LandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      budget: '$1000-$5000',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/leads', data);
      if (response.data?.success) {
        addToast('Lead submitted successfully! Recorded in MongoDB.', 'success');
        setSubmitted(true);
        reset();
      }
    } catch (error) {
      const errMsg = error.message || 'Failed to submit lead. Please try again.';
      addToast(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-8 lg:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start my-auto">
        
        {/* LEFT COLUMN: Clean Display Typography & Off-Grid Real-Time Data Chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-6 flex flex-col items-start pt-2"
        >
          {/* Main Headline with Tight Tracking and One Solid Accent Word */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.08]">
            Turn inbound interest into{' '}
            <span className="text-[var(--accent)] font-semibold">qualified revenue.</span>
          </h1>

          {/* Subtitle with High Readability */}
          <p className="mt-5 text-sm sm:text-base text-[var(--text-secondary)] max-w-lg leading-relaxed">
            Capture, qualify, and route enterprise inbound leads in real time. Built with linear simplicity, multi-layer validation, and secure MongoDB persistence.
          </p>

          {/* OFF-GRID FLOATING METRIC CHIPS (Inspired by Agio Reference UI) */}
          <div className="mt-10 grid grid-cols-3 gap-3 w-full max-w-md">
            <div className="card-flat p-3 flex flex-col">
              <span className="text-[11px] font-medium text-[var(--text-muted)]">API Latency</span>
              <span className="font-mono text-base font-bold text-[var(--text-primary)] mt-0.5">&lt;50ms</span>
            </div>

            <div className="card-flat p-3 flex flex-col">
              <span className="text-[11px] font-medium text-[var(--text-muted)]">Avg Deal</span>
              <span className="font-mono text-base font-bold text-[var(--text-primary)] mt-0.5">$1k-$5k</span>
            </div>

            <div className="card-flat p-3 flex flex-col">
              <span className="text-[11px] font-medium text-[var(--text-muted)]">Security</span>
              <span className="font-mono text-base font-bold text-[var(--text-primary)] mt-0.5">HttpOnly</span>
            </div>
          </div>

          {/* Value Props Strip */}
          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] w-full max-w-md flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
              Zod Client & Express Validation
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Instant MongoDB Status Sync
            </span>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Elevated Integrated Lead Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-6 w-full"
        >
          <div className="card-elevated p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <h2 className="font-display text-lg font-bold text-[var(--text-primary)] tracking-tight">
                  Request a Demo
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Submit lead parameters directly to the MongoDB pipeline.
                </p>
              </div>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto mb-3">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-1">
                  Lead Submitted
                </h3>
                <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto mb-6">
                  Saved with status <span className="font-mono text-[var(--accent)] font-semibold">New</span>. Log into <span className="font-semibold text-[var(--text-primary)]">/admin</span> to inspect.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  Submit Another Lead
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      {...register('name')}
                      className={`w-full px-3 py-2 text-xs input-field ${
                        errors.name ? 'border-rose-500 focus:border-rose-500' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-[11px] text-rose-500">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                      Work Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      {...register('email')}
                      className={`w-full px-3 py-2 text-xs input-field ${
                        errors.email ? 'border-rose-500 focus:border-rose-500' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-[11px] text-rose-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Budget Range Selector */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                    Budget Range <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['< $500', '$500-$1000', '$1000-$5000', '> $5000'].map((opt) => (
                      <label
                        key={opt}
                        className="cursor-pointer flex items-center justify-center py-2 px-2 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent-light)] text-[11px] font-mono font-medium text-[var(--text-secondary)] has-[:checked]:text-[var(--accent)] transition-all"
                      >
                        <input
                          type="radio"
                          value={opt}
                          {...register('budget')}
                          className="sr-only"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  {errors.budget && (
                    <p className="mt-1 text-[11px] text-rose-500">{errors.budget.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Project Overview & Requirements <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your project requirements (min 10 characters)..."
                    {...register('message')}
                    className={`w-full px-3 py-2 text-xs input-field resize-none ${
                      errors.message ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-[11px] text-rose-500">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 btn-primary text-xs flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Lead Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
