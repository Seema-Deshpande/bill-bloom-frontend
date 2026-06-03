import apiClient from '../api/apiClient.js';
import { ANALYTICS_API } from '../config/apiConfig.js';
import { smartExtractData } from '../utils/extractApiData.js';

export async function getMonthlyPersonal() {
 const res =  await apiClient.get(ANALYTICS_API.PERSONAL);
 const data = smartExtractData(res);
 return Array.isArray(data) ? data : [];
}

export async function getGroupSpending() {
   const res = await apiClient.get(ANALYTICS_API.GROUP_SPENDING);
   const data = smartExtractData(res);
   return Array.isArray(data) ? data : [];
}

export async function getGroupCategories(groupId) {
    const res = await apiClient.get(ANALYTICS_API.GROUP_CATEGORIES(groupId));
    const data = smartExtractData(res);
    return Array.isArray(data) ? data : [];
}

export async function getPersonalCategories() {
   const res = await apiClient.get(ANALYTICS_API.PERSONAL_CATEGORIES);
   const data = smartExtractData(res);
   return Array.isArray(data) ? data : [];
}

