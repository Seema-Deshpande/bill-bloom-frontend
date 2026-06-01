import apiClient from '../api/apiClient.js';
import { ANALYTICS_API } from '../config/apiConfig.js';

export async function getMonthlyPersonal() {
 const res =  await apiClient.get(ANALYTICS_API.PERSONAL);
 return res.data
}

export async function getGroupSpending() {
   const res = await apiClient.get(ANALYTICS_API.GROUP_SPENDING);
   return res.data
}

export async function getGroupCategories(groupId) {
    const res = await apiClient.get(ANALYTICS_API.GROUP_CATEGORIES(groupId));
    return res.data
}

export async function getPersonalCategories() {
   const res = await apiClient.get(ANALYTICS_API.PERSONAL_CATEGORIES);
   return res.data
}

