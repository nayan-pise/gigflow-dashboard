import express from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/leadController';
import { protect, admin } from '../middlewares/authMiddleware';
import { body } from 'express-validator';

const router = express.Router();

// Routes
router.route('/export').get(protect, exportLeads); // Export must come before /:id to avoid matching id='export'

router
  .route('/')
  .get(protect, getLeads)
  .post(
    protect,
    [
      body('name').notEmpty().withMessage('Name is required'),
      body('email').isEmail().withMessage('Please include a valid email'),
      body('source').isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
    ],
    createLead
  );

router
  .route('/:id')
  .get(protect, getLeadById)
  .put(
    protect,
    [
      body('email').optional().isEmail().withMessage('Please include a valid email'),
      body('status')
        .optional()
        .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
        .withMessage('Invalid status'),
      body('source').optional().isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
    ],
    updateLead
  )
  .delete(protect, admin, deleteLead); // Admin required for deletion

export default router;
