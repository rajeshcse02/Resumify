import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/templates`;

export const fetchAllTemplates = async () => {
  const response = await axios.get(API_BASE);
  return response.data;
};

export const fetchTemplateByName = async (templateName) => {
  const response = await axios.get(`${API_BASE}/${templateName}`);
  return response.data;
};
