import apiClient from "../api/apiClient";
import { GROUP_API } from "../config/apiConfig";

export const createGroup =  async (groupData) => {
    const res = await apiClient.post(GROUP_API.BASE, { groupData });
    return res.data;
};

export const getGroups = async () => {
    const res = await apiClient.get(GROUP_API.BASE);
    return res.data;
}

export const getGroupById = async (groupId) => {
    const res = await  apiClient.get(GROUP_API.DETAIL(groupId));
    return res.data;
}

export const updateGroup = async (groupId, groupData) => {
    const res = await apiClient.put(GROUP_API.DETAIL(groupId), { groupData });
    return res.data;
}

export const deleteGroup = async (groupId) => {
    const res = await apiClient.delete(GROUP_API.DETAIL(groupId))
    return res.data;
}

export default {
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
};