const { z } = require('zod');

const leadSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address'),
  budget: z.enum(['< $500', '$500-$1000', '$1000-$5000', '> $5000'], {
    required_error: 'Budget range selection is required',
    invalid_type_error: 'Invalid budget range option selected',
  }),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters long')
    .max(2000, 'Message cannot exceed 2000 characters'),
});

const statusUpdateSchema = z.object({
  status: z.enum(['New', 'Contacted', 'Closed'], {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be New, Contacted, or Closed',
  }),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
});

module.exports = {
  leadSchema,
  statusUpdateSchema,
  loginSchema,
};
