import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    templateName: { type: String, required: true },
    resumeData: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  resumes: {
    type: [resumeSchema],  // <== Important: define as array of ResumeSchema
    default: [],           // default empty array
  }
});

export default mongoose.model('User', userSchema);
