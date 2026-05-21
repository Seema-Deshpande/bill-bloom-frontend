// create , fetch , delete expenses
import {fetchAPI} from "../api/apiClient.js";
import { EXPENSE_API } from "../config/apiConfig.js";


export const createExpense = async (expenseData) => {
    return  await fetchAPI(EXPENSE_API.BASE, {
        method: "POST",
        body: JSON.stringify(expenseData),
    });
};

export const getGroupExpenses = async (groupId) => {
    return await fetchAPI(EXPENSE_API.GROUP(groupId));
}
export const getPersonalExpenses  = async () => {
    return await fetchAPI(EXPENSE_API.PERSONAL)

}
export const deleteExpense = async (expenseId) => {
   return await fetchAPI(EXPENSE_API.DETAIL(expenseId), {
        method: "DELETE",
    });
}



export default {
    createExpense,
    getGroupExpenses,
    getPersonalExpenses,
    deleteExpense,
};  