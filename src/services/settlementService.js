import apiClient from '../api/apiClient.js';
import { SETTLEMENT_API } from '../config/apiConfig.js';

export const getCalculatedSettlements = async (groupId) => {
    const res = await apiClient.get(SETTLEMENT_API.CALCULATE(groupId));
    return res.data;
};

export const recordSettlement = async ({ fromId, toId, amount,groupId}) => {
   const res = await apiClient.post(SETTLEMENT_API.BASE, { fromId, toId, amount, groupId });
   return res.data;
}

export const getGroupSettlements = async (groupId) => {
   const res =  await apiClient.get(SETTLEMENT_API.LIST(groupId));
    return res.data;
}

export default {
    getCalculatedSettlements,
    recordSettlement,
    getGroupSettlements
}