import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/templates';

export const fetchAllTemplates = async () => {
  const response = await axios.get(API_BASE);
  return response.data;
};

export const fetchTemplateByName = async (templateName) => {
  const response = await axios.get(`${API_BASE}/${templateName}`);
  return response.data;
};
