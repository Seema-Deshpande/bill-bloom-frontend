import axios from 'axios'; 
import { GROUP_API } from "../config/apiConfig";

export const createGroup =  async (groupData) => {
    const res = await axios.post(GROUP_API.BASE, { groupData });
    return res
};

export const getGroups = async () => {
    const res = await axios.get(GROUP_API.BASE);
    return res;
}

export const getGroupById = async (groupId) => {
    const res = await axios.get(GROUP_API.DETAIL(groupId));
    return res
}

export const updateGroup = async (groupId, groupData) => {
    const res = await axios.put(GROUP_API.DETAIL(groupId), { groupData });
    return res
}

export const deleteGroup = async (groupId) => {
    const res = await axios.delete(GROUP_API.DETAIL(groupId))
    return res
}

export default {
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
};