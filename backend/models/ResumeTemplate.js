import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  position: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, default: '' },
});

const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  school: { type: String, required: true },
  duration: { type: String, required: true },
});

const CustomSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
});

const ResumeTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // e.g. "ModernProfessional"
  displayName: { type: String, required: true },          // e.g. "Modern Professional"
  dummyData: {
    name: String,
    title: String,
    email: String,
    phone: String,
    address: String,
    linkedin: String,
    website: String,
    summary: String,
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: [String],
    customSections: [CustomSectionSchema],
    image:String, // Base64 encoded image  
  },
}, { timestamps: true });

export default mongoose.model('ResumeTemplate', ResumeTemplateSchema);
