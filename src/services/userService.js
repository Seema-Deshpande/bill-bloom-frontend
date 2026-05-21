import { fetchAPI } from "../api/apiClient.js";
import { USER_API } from "../config/apiConfig.js";

export const searchUsers = async (query) => {
    const res = await fetchAPI(USER_API.SEARCH(query));
    return res.data ?? res;
};

export default {
    searchUsers,
};