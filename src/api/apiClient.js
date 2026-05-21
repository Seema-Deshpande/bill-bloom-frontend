const API_BASE_URL = "http://localhost:3000/api";
const getStoredToken = () => {
      const token = localStorage.getItem("token");
    return token || null;
};

export const fetchAPI = async (endpoint, options = {}) => {
    if (!endpoint || typeof endpoint !== "string") {
        throw new Error(`fetchAPI called with invalid endpoint: ${String(endpoint)}`);
    }
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getStoredToken();

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    }

    const response = await fetch(url, config);
    if (response.status === 401) {
        console.warn("Unauthorized access - clearing token");
        localStorage.removeItem("token");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
    }

    if (response.status === 204) {
        return null;
    }

    return data
}

export default fetchAPI;