import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

// GET all user resumes
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('resumes').lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.resumes || []);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET one resume by id
router.get('/:resumeId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('resumes').lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    const resume = user.resumes.find(r => r._id.toString() === req.params.resumeId);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create or update resume
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { _id, templateName, resumeData } = req.body;

    if (!_id) {
      user.resumes.push({ templateName, resumeData });
    } else {
      const idx = user.resumes.findIndex(r => r._id.toString() === _id);
      if (idx === -1) return res.status(404).json({ error: 'Resume not found' });
      user.resumes[idx].resumeData = resumeData;
      user.resumes[idx].templateName = templateName;
    }
    await user.save();
    res.json({ message: 'Resume saved', resumes: user.resumes });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a resume by id
router.delete('/:resumeId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const idx = user.resumes.findIndex(r => r._id.toString() === req.params.resumeId);
    if (idx === -1) return res.status(404).json({ error: 'Resume not found' });
    user.resumes.splice(idx, 1);
    await user.save();
    res.json({ message: 'Resume deleted', resumes: user.resumes });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a resume by templateName
router.delete('/template/:templateName', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const idx = user.resumes.findIndex(r => r.templateName === req.params.templateName);
    if (idx === -1) return res.status(404).json({ error: 'Resume not found' });
    user.resumes.splice(idx, 1);
    await user.save();
    res.json({ message: 'Resume deleted', resumes: user.resumes });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
