import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 0, // Infinite timeout to prevent network dropouts
});

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.detail || "A network error occurred. Please try again.";
        return Promise.reject(new Error(message));
    }
);

export const api = {
    // Now accepts skip and limit for pagination!
    processBatchLeads: (skip = 0, limit = 3) => apiClient.post(`/process-batch?skip=${skip}&limit=${limit}`),
    processSingleLead: (payload) => apiClient.post('/process-lead', payload),
};