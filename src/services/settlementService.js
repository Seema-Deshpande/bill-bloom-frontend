//Calculate and store settlements

import {fetchAPI} from '../api/apiClient.js';
import { SETTLEMENT_API } from '../config/apiConfig.js';

export const getCalculatedSettlements = async (groupId) => {
    return await fetchAPI(SETTLEMENT_API.CALCULATE(groupId));
};

export const recordSettlement = async ({ fromId, toId, amount,groupId}) => {
   return await fetchAPI(SETTLEMENT_API.BASE, {
        method: "POST",
        body: { fromId, toId, amount, groupId },
    });
}

export const getGroupSettlements = async (groupId) => {
    return await fetchAPI(SETTLEMENT_API.LIST(groupId));
}

export default {
    getCalculatedSettlements,
    recordSettlement,
    getGroupSettlements
}