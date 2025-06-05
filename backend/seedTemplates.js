// seedTemplates.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import ResumeTemplate from './models/ResumeTemplate.js';

dotenv.config();

function imageToBase64(path) {
  const imageBuffer = fs.readFileSync(path);
  const base64Image = imageBuffer.toString('base64');
  const mimeType = 'image/png'; 
  return `data:${mimeType};base64,${base64Image}`;
}

const base64Image = imageToBase64('./assets/elegant.png'); 
// console.log('Base64 Image:', base64Image);

const dummyTemplate = {
  name: 'Elegant',
  displayName: 'Elegant',
  dummyData: {
    name: 'John Doe',
    title: 'Full Stack Developer',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    address: '123 Developer Lane, Silicon Valley, CA',
    linkedin: 'linkedin.com/in/johndoe',
    website: 'johndoe.dev',
    summary: 'Passionate full-stack developer with 5+ years of experience building scalable web apps.',
    experience: [
      {
        position: 'Senior Developer',
        company: 'TechCorp',
        duration: 'Jan 2020 - Present',
        description: 'Leading a team of developers building modern SaaS solutions.',
      },
      {
        position: 'Frontend Developer',
        company: 'WebWorks',
        duration: 'Jun 2017 - Dec 2019',
        description: 'Developed responsive user interfaces using React and Vue.',
      },
    ],
    education: [
      {
        degree: 'B.Sc. in Computer Science',
        school: 'Stanford University',
        duration: '2013 - 2017',
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'CSS', 'Git'],
    customSections: [
      {
        title: 'Certifications',
        content: 'AWS Certified Developer, Google Cloud Associate Engineer',
      },
      {
        title: 'Projects',
        content: 'Built an open-source portfolio builder with React and Express.',
      },
    ],
    image : base64Image,
  },
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existing = await ResumeTemplate.findOne({ name: dummyTemplate.name });
    if (existing) {
      console.log('Template already exists. Updating it...');
      await ResumeTemplate.findOneAndUpdate({ name: dummyTemplate.name }, dummyTemplate);
    } else {
      await ResumeTemplate.create(dummyTemplate);
      console.log('Template seeded successfully!');
    }
  } catch (err) {
    console.error('Error seeding template:', err);
  } finally {
    mongoose.connection.close();
  }
};

seed();
