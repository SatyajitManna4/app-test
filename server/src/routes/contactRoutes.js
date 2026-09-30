import express from 'express';
import {
  createContact,
  getContacts,
  getContactById,
} from '../controllers/contactController.js';

const router = express.Router();

// POST /api/contact -> Submit new contact form
// GET  /api/contact -> Get all submitted contacts
router.route('/')
  .post(createContact)
  .get(getContacts);

// GET /api/contact/:id -> Get specific contact record
router.route('/:id')
  .get(getContactById);

export default router;
