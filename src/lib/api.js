import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
    withCredentials: true, // Send cookies with requests
});

// Add a request interceptor to include the token in the header if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle unauthorized errors (401)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Handle token expiration or unauthorized access
            // localStorage.removeItem("accessToken");
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
