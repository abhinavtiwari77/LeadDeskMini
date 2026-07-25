const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    budget: {
      type: String,
      required: [true, 'Budget range is required'],
      enum: {
        values: ['< $500', '$500-$1000', '$1000-$5000', '> $5000'],
        message: 'Invalid budget range selected',
      },
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Closed'],
        message: 'Status must be New, Contacted, or Closed',
      },
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

// Search indexing for fast queries
leadSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('Lead', leadSchema);
