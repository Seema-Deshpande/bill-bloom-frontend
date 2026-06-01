import axios from 'axios' 
import { SETTLEMENT_API } from '../config/apiConfig.js';

export const getCalculatedSettlements = async (groupId) => {
    return await axios.get(SETTLEMENT_API.CALCULATE(groupId));
};

export const recordSettlement = async ({ fromId, toId, amount,groupId}) => {
   return await axios.post(SETTLEMENT_API.BASE, { fromId, toId, amount, groupId });
}

export const getGroupSettlements = async (groupId) => {
    return await axios.get(SETTLEMENT_API.LIST(groupId));
}

export default {
    getCalculatedSettlements,
    recordSettlement,
    getGroupSettlements
}