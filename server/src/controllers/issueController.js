const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Issue = require('../models/Issue');

const buildIssueFilters = ({ q, status, priority, severity }, userId) => {
  const filters = { createdBy: userId };

  if (q) {
    filters.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }

  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  if (severity) filters.severity = severity;

  return filters;
};

const createIssue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { title, description, priority, severity, status } = req.body;

  const issue = await Issue.create({
    title,
    description,
    priority,
    severity,
    status,
    createdBy: req.user._id,
    resolvedAt: status === 'Resolved' || status === 'Closed' ? new Date() : null,
  });

  return res.status(201).json({ issue });
};

const getIssues = async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const filters = buildIssueFilters(req.query, req.user._id);

  const [issues, total] = await Promise.all([
    Issue.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Issue.countDocuments(filters),
  ]);

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return res.status(200).json({
    issues,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
};

const getIssueById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid issue id' });
  }

  const issue = await Issue.findOne({ _id: id, createdBy: req.user._id });
  if (!issue) {
    return res.status(404).json({ message: 'Issue not found' });
  }

  return res.status(200).json({ issue });
};

const updateIssue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid issue id' });
  }

  const existingIssue = await Issue.findOne({ _id: id, createdBy: req.user._id });
  if (!existingIssue) {
    return res.status(404).json({ message: 'Issue not found' });
  }

  const updates = { ...req.body };
  if (updates.status === 'Resolved' || updates.status === 'Closed') {
    updates.resolvedAt = new Date();
  }
  if (updates.status === 'Open' || updates.status === 'In Progress') {
    updates.resolvedAt = null;
  }

  const issue = await Issue.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({ issue });
};

const updateIssueStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid issue id' });
  }

  if (!['Open', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const issue = await Issue.findOne({ _id: id, createdBy: req.user._id });
  if (!issue) {
    return res.status(404).json({ message: 'Issue not found' });
  }

  issue.status = status;
  issue.resolvedAt = status === 'Resolved' || status === 'Closed' ? new Date() : null;
  await issue.save();

  return res.status(200).json({ issue });
};

const deleteIssue = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid issue id' });
  }

  const issue = await Issue.findOneAndDelete({ _id: id, createdBy: req.user._id });

  if (!issue) {
    return res.status(404).json({ message: 'Issue not found' });
  }

  return res.status(200).json({ message: 'Issue deleted successfully' });
};

const getIssueStats = async (req, res) => {
  const counts = await Issue.aggregate([
    { $match: { createdBy: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = {
    Open: 0,
    'In Progress': 0,
    Resolved: 0,
    Closed: 0,
  };

  counts.forEach((item) => {
    summary[item._id] = item.count;
  });

  return res.status(200).json({ summary });
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
  getIssueStats,
};
