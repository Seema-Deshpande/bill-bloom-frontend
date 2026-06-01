import axios from 'axios'
import { USER_API } from "../config/apiConfig.js";

export const searchUsers = async (query) => {
    const res = await axios.get(USER_API.SEARCH(query));
    return res
};

export default {
    searchUsers,
};