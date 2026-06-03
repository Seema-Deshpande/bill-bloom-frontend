import apiClient from "../api/apiClient.js";
import { EXPENSE_API } from "../config/apiConfig.js";
import { smartExtractData } from "../utils/extractApiData.js";

export const createExpense = async (expenseData) => {
    const res =  await apiClient.post(EXPENSE_API.BASE, expenseData);
    return smartExtractData(res);
};

export const getGroupExpenses = async (groupId) => {
    const res = await apiClient.get(EXPENSE_API.GROUP(groupId));
    const data = smartExtractData(res);
    return Array.isArray(data) ? data : [];
}

export const getPersonalExpenses  = async () => {
    const res =  await apiClient.get(EXPENSE_API.PERSONAL)
    const data = smartExtractData(res);
    return Array.isArray(data) ? data : [];
}

export const deleteExpense = async (expenseId) => {
  const res =  await apiClient.delete(EXPENSE_API.DETAIL(expenseId))
  return smartExtractData(res);
}

export default {
    createExpense,
    getGroupExpenses,
    getPersonalExpenses,
    deleteExpense,
};