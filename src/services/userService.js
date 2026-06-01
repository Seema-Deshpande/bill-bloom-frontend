import { USER_API } from "../config/apiConfig.js";
import apiClient from '../api/apiClient.js';

export const searchUsers = async (query) => {
    const res = await apiClient.get(USER_API.SEARCH(query));
    return res.data
};

export default {
    searchUsers,
};