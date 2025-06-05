import express from 'express';
import ResumeTemplate from '../models/ResumeTemplate.js';

const router = express.Router();

// GET /templates
router.get('/', async (req, res) => {
  try {
    const templates = await ResumeTemplate.find({}, {
      name: 1,
      displayName: 1,
      'dummyData.image': 1,
    }).lean();

    res.json(templates);
  } catch (err) {
    console.error('Failed to fetch templates:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /templates/:templateName
// Returns a single template's dummyData by template name
router.get('/:templateName', async (req, res) => {
  const { templateName } = req.params;
  try {
    const template = await ResumeTemplate.findOne({ name: templateName }).lean();
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (err) {
    console.error('Failed to fetch template:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
