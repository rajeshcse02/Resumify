import ResumeTemplate from '../models/ResumeTemplate.js';
import UserResume from '../models/UserResume.js';

export const getAllTemplates = async (req, res) => {
  try {
    const templates = await ResumeTemplate.find();
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const template = await ResumeTemplate.findById(req.params.templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.status(200).json(template);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch template' });
  }
};

export const saveResume = async (req, res) => {
  const { templateId, resumeData } = req.body;

  try {
    const newResume = new UserResume({
      user: req.user.id,
      templateId,
      resumeData
    });

    await newResume.save();
    res.status(201).json({ message: 'Resume saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save resume' });
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const resumes = await UserResume.find({ user: req.user.id }).populate('templateId');
    res.status(200).json(resumes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user resumes' });
  }
};

export const getUserResumeById = async (req, res) => {
  try {
    const resume = await UserResume.findOne({
      _id: req.params.resumeId,
      user: req.user.id
    }).populate('templateId');

    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.status(200).json(resume);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch resume' });
  }
};
