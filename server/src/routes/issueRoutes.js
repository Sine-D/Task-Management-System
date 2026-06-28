const express = require('express');
const { body } = require('express-validator');
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
  getIssueStats,
} = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const issueValidationRules = [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('status')
    .optional()
    .isIn(['Open', 'In Progress', 'Resolved', 'Closed'])
    .withMessage('Invalid status'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']).withMessage('Invalid priority'),
  body('severity').optional().isIn(['Minor', 'Major', 'Critical', 'Blocker']).withMessage('Invalid severity'),
];

const issueUpdateValidationRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('status')
    .optional()
    .isIn(['Open', 'In Progress', 'Resolved', 'Closed'])
    .withMessage('Invalid status'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']).withMessage('Invalid priority'),
  body('severity').optional().isIn(['Minor', 'Major', 'Critical', 'Blocker']).withMessage('Invalid severity'),
];

router.use(protect);

router.get('/stats', getIssueStats);
router.get('/', getIssues);
router.get('/:id', getIssueById);
router.post('/', issueValidationRules, createIssue);
router.put('/:id', issueUpdateValidationRules, updateIssue);
router.patch('/:id/status', [body('status').isIn(['Open', 'In Progress', 'Resolved', 'Closed'])], updateIssueStatus);
router.delete('/:id', deleteIssue);

module.exports = router;
