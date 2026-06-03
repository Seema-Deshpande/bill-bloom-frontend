import apiClient from "../api/apiClient";
import { GROUP_API } from "../config/apiConfig";
import { smartExtractData } from "../utils/extractApiData";

export const createGroup =  async (groupData) => {
    const res = await apiClient.post(GROUP_API.BASE, groupData);
    return smartExtractData(res);
};

export const getGroups = async () => {
    const res = await apiClient.get(GROUP_API.BASE);
    const data = smartExtractData(res);
    return Array.isArray(data) ? data : [];
}

export const getGroupById = async (groupId) => {
    const res = await  apiClient.get(GROUP_API.DETAIL(groupId));
    const responseData = res.data;
    
    // The backend returns { message, group, expenses }
    // Return the group object which includes populated createdBy and members
    if (responseData.group) {
        return responseData.group;
    }
    
    // Fallback to smartExtractData if structure is different
    return smartExtractData(res);
}

export const updateGroup = async (groupId, groupData) => {
    const res = await apiClient.put(GROUP_API.DETAIL(groupId), groupData);
    return smartExtractData(res);
}

export const deleteGroup = async (groupId) => {
    const res = await apiClient.delete(GROUP_API.DETAIL(groupId))
    return smartExtractData(res);
}

export default {
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
};