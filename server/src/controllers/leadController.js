const Lead = require('../models/Lead');
const ApiError = require('../utils/ApiError');
const asyncWrapper = require('../utils/asyncWrapper');

// @desc    Create a new lead (Public lead capture)
// @route   POST /api/leads
// @access  Public
const createLead = asyncWrapper(async (req, res) => {
  const { name, email, budget, message } = req.body;

  const lead = await Lead.create({
    name,
    email,
    budget,
    message,
    status: 'New',
  });

  res.status(201).json({
    success: true,
    message: 'Thank you! Your lead request has been submitted successfully.',
    data: lead,
  });
});

// @desc    Get all leads with search & status filtering
// @route   GET /api/leads
// @access  Private (Admin)
const getLeads = asyncWrapper(async (req, res) => {
  const { search, status } = req.query;

  let query = {};

  // Search filter (regex search on name or email)
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  // Status filter
  if (status && ['New', 'Contacted', 'Closed'].includes(status)) {
    query.status = status;
  }

  const leads = await Lead.find(query).sort({ createdAt: -1 });

  // Calculate high-level summary counts for admin dashboard header cards
  const totalCount = await Lead.countDocuments();
  const newCount = await Lead.countDocuments({ status: 'New' });
  const contactedCount = await Lead.countDocuments({ status: 'Contacted' });
  const closedCount = await Lead.countDocuments({ status: 'Closed' });

  res.status(200).json({
    success: true,
    count: leads.length,
    stats: {
      total: totalCount,
      new: newCount,
      contacted: contactedCount,
      closed: closedCount,
    },
    data: leads,
  });
});

// @desc    Update lead status
// @route   PATCH /api/leads/:id/status
// @access  Private (Admin)
const updateLeadStatus = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const lead = await Lead.findById(id);

  if (!lead) {
    throw new ApiError(404, `Lead not found with id ${id}`);
  }

  lead.status = status;
  await lead.save();

  res.status(200).json({
    success: true,
    message: `Lead status successfully updated to '${status}'`,
    data: lead,
  });
});

module.exports = {
  createLead,
  getLeads,
  updateLeadStatus,
};
