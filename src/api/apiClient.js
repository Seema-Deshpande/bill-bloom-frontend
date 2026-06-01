
import axios from 'axios';

const API_BASE_URL = "http://localhost:3000/api";

const getStoredToken = () => {
    const token = localStorage.getItem("token");
    return token || null;
};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

// Request interceptor - add authorization token
apiClient.interceptors.request.use(
    (config) => {
        const token = getStoredToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors and unauthorized access
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            // Redirect to login (you may need to use window.location or router)
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const fetchAPI = async (endpoint, options = {}) => {
    const { method = 'GET', body, headers, ...rest } = options;
    let data = rest.data;
    
    if (body !== undefined && data === undefined) {
        if (typeof body === 'string') {
            try {
                data = JSON.parse(body);
            } catch {
                data = body;
            }
        } else {
            data = body;
        }
    }
    
    try {
        const response = await apiClient.request({
            url: endpoint,
            method,
            headers,
            data,
            ...rest,
        });
        return response.data;
    } catch (error) {
        // Handle API errors with proper error messages
        if (error.response) {
            const errorData = error.response.data || {};
            const message = errorData.message || `API Error: ${error.response.status}`;
            const normalizedError = new Error(message);
            normalizedError.response = {
                status: error.response.status,
                data: errorData,
            };
            throw normalizedError;
        }
        
        // Handle network errors
        if (error.message === 'Network Error') {
            throw new Error('Network error: Unable to reach the server. Make sure the backend is running.');
        }
        
        throw error;
    }
};

export default apiClient;