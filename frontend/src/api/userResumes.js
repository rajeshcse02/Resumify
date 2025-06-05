import axios from 'axios';

// Fetch all resumes saved by the logged-in user
export const fetchUserResumes = async () => {
  const res = await axios.get('/api/user-resumes');
  return res.data;
};

// Fetch a specific resume by ID
export const fetchUserResumeById = async (resumeId) => {
  const res = await axios.get(`/api/user-resumes/${resumeId}`);
  return res.data;
};

// Save a new or updated resume
export const saveUserResume = async (resume) => {
  const res = await axios.post('/api/user-resumes', resume);
  return res.data;
};
