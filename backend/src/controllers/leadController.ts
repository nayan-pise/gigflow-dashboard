import { Request, Response } from 'express';
import Lead from '../models/Lead';
import { validationResult } from 'express-validator';
import { parse } from 'json2csv';

// @desc    Get all leads with pagination, filtering, search, sorting
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const { status, source, search, sort } = req.query;

    let query: any = {};

    // RBAC: If Sales user, only show their leads? Requirements don't strictly specify data isolation, 
    // but typically Sales users might see only theirs or all depending on org. 
    // Let's assume they can see all leads for this assignment unless specified.
    // We will just filter based on query params.

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
      ];
    }

    let sortOptions: any = { createdAt: -1 }; // Default Latest
    if (sort === 'Oldest') {
      sortOptions = { createdAt: 1 };
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    res.json({
      leads,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

    if (lead) {
      res.json(lead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, status, source } = req.body;

  try {
    const leadExists = await Lead.findOne({ email });
    if (leadExists) {
      res.status(400).json({ message: 'Lead with this email already exists' });
      return;
    }

    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
      createdBy: req.user?._id,
    });

    res.status(201).json(lead);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, status, source } = req.body;

  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    lead.name = name || lead.name;
    lead.email = email || lead.email;
    lead.status = status || lead.status;
    lead.source = source || lead.source;

    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin only recommended, but maybe open based on assignment)
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    await lead.deleteOne();
    res.json({ message: 'Lead removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export leads to CSV
// @route   GET /api/leads/export
// @access  Private
export const exportLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, source, search } = req.query;
    let query: any = {};

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query).populate('createdBy', 'name').lean();

    if (leads.length === 0) {
      res.status(404).json({ message: 'No leads found to export' });
      return;
    }

    const fields = ['_id', 'name', 'email', 'status', 'source', 'createdAt', 'createdBy.name'];
    const opts = { fields };

    const csv = parse(leads, opts);

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
