const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLeadStatus,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  leadSchema,
  statusUpdateSchema,
} = require('../utils/validationSchemas');

// Public route: submit lead
router.post('/', validate(leadSchema), createLead);

// Protected admin routes
router.get('/', protect, getLeads);
router.patch('/:id/status', protect, validate(statusUpdateSchema), updateLeadStatus);

module.exports = router;
