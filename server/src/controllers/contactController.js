import { Contact } from '../models/Contact.js';

/**
 * @desc    Submit a new contact us inquiry
 * @route   POST /api/contact
 * @access  Public
 */
export const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, subject, message } = req.body;

    // Check for missing fields
    const missingFields = [];
    if (!firstName?.trim()) missingFields.push('firstName');
    if (!lastName?.trim()) missingFields.push('lastName');
    if (!email?.trim()) missingFields.push('email');
    if (!phone?.trim()) missingFields.push('phone');
    if (!address?.trim()) missingFields.push('address');
    if (!subject?.trim()) missingFields.push('subject');
    if (!message?.trim()) missingFields.push('message');

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // Save to MongoDB
    const contact = await Contact.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      status: 'success',
      message: 'Thank you! Your contact message has been saved successfully.',
      data: contact,
    });
  } catch (error) {
    console.error('[Create Contact Error]:', error);

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join('. '),
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while saving contact message.',
    });
  }
};

/**
 * @desc    Get all contact submissions
 * @route   GET /api/contact
 * @access  Public (or Admin)
 */
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: 'success',
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('[Get Contacts Error]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Could not fetch contact submissions.',
    });
  }
};

/**
 * @desc    Get a single contact submission by ID
 * @route   GET /api/contact/:id
 * @access  Public (or Admin)
 */
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact record not found.',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: contact,
    });
  } catch (error) {
    console.error('[Get Contact By ID Error]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error retrieving contact record.',
    });
  }
};
