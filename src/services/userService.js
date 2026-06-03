import { USER_API } from "../config/apiConfig.js";
import apiClient from '../api/apiClient.js';
import { smartExtractData } from '../utils/extractApiData.js';

export const searchUsers = async (query) => {
    const res = await apiClient.get(USER_API.SEARCH(query));
    const data = smartExtractData(res);
    return Array.isArray(data) ? data : [];
};

export default {
    searchUsers,
};