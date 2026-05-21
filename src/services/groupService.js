// CRUD operations for groups
import {fetchAPI} from "../api/apiClient.js";
import { GROUP_API } from "../config/apiConfig";

const unwrapData = (response) => response?.data ?? response;

export const createGroup =  async (groupData) => {
    const res = await fetchAPI(GROUP_API.BASE, {
        method: "POST",
        body: JSON.stringify(groupData),
    });
    return unwrapData(res);
};

export const getGroups = async () => {
    const res = await fetchAPI(GROUP_API.BASE);
    return unwrapData(res);
}

export const getGroupById = async (groupId) => {
    const res = await fetchAPI(GROUP_API.DETAIL(groupId));
    return unwrapData(res);
}

export const updateGroup = async (groupId, groupData) => {
    const res = await fetchAPI(GROUP_API.DETAIL(groupId), {
        method: "PUT",
        body: JSON.stringify(groupData),
    });
    return unwrapData(res);
}

export const deleteGroup = async (groupId) => {
    const res = await fetchAPI(GROUP_API.DETAIL(groupId), {
        method: "DELETE",
    });
    return unwrapData(res);
}

export default {
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
};