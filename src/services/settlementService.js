import apiClient from '../api/apiClient.js';
import { SETTLEMENT_API } from '../config/apiConfig.js';
import { smartExtractData } from '../utils/extractApiData.js';

export const getCalculatedSettlements = async (groupId) => {
    const res = await apiClient.get(SETTLEMENT_API.CALCULATE(groupId));
    const data = smartExtractData(res);
    return Array.isArray(data) ? data : [];
};

export const recordSettlement = async ({ fromId, toId, amount, groupId }) => {
   const res = await apiClient.post(SETTLEMENT_API.BASE, { fromId, toId, amount, groupId });
   return smartExtractData(res);
}

export const getGroupSettlements = async (groupId) => {
   const res =  await apiClient.get(SETTLEMENT_API.LIST(groupId));
   const data = smartExtractData(res);
   return Array.isArray(data) ? data : [];
}

export default {
    getCalculatedSettlements,
    recordSettlement,
    getGroupSettlements
}