import apiClient from "../api/apiClient.js";
import { EXPENSE_API } from "../config/apiConfig.js";


export const createExpense = async (expenseData) => {
    const res =  await apiClient.post(EXPENSE_API.BASE, { expenseData });
    return res.data;
};

export const getGroupExpenses = async (groupId) => {
    const res = await apiClient.get(EXPENSE_API.GROUP(groupId));
    return res.data;
}
export const getPersonalExpenses  = async () => {
    const res =  await apiClient.get(EXPENSE_API.PERSONAL)
    return res.data

}
export const deleteExpense = async (expenseId) => {
  const res =  await apiClient.delete(EXPENSE_API.DETAIL(expenseId))
  return res.data
}



export default {
    createExpense,
    getGroupExpenses,
    getPersonalExpenses,
    deleteExpense,
};  