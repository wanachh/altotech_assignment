import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

export const getBuildingSummary = () => api.get('summary/');
export const getMachines = () => api.get('machines/');
export const getAILogs = () => api.get('ai-logs/');
export const getEnergyCompare = () => api.get('energy-compare/');

export default api;