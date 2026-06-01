import axios from 'axios'
import { EXPENSE_API } from "../config/apiConfig.js";


export const createExpense = async (expenseData) => {
    return  await axios.post(EXPENSE_API.BASE, { expenseData });
};

export const getGroupExpenses = async (groupId) => {
    return await axios.get(EXPENSE_API.GROUP(groupId));
}
export const getPersonalExpenses  = async () => {
    return await axios.get(EXPENSE_API.PERSONAL)

}
export const deleteExpense = async (expenseId) => {
   return await axios.delete(EXPENSE_API.DETAIL(expenseId), {
        method: "DELETE",
    });
}



export default {
    createExpense,
    getGroupExpenses,
    getPersonalExpenses,
    deleteExpense,
};  