import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://placements-zrea.onrender.com/api", // Use environment variable or fallback
  withCredentials: false, // Disable credentials as we're using localStorage
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to attach the token from localStorage to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const persistedRoot = localStorage.getItem("persist:root");
    if (persistedRoot) {
      const parsedRoot = JSON.parse(persistedRoot);
      const token = parsedRoot.token && JSON.parse(parsedRoot.token);
      if (token && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optionally, add a response interceptor for global error handling
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Optionally, handle 401 errors (unauthorized) globally
//       localStorage.removeItem("persist:root"); // Clear token if necessary
//       window.location.href = "/login"; // Redirect to login page
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
