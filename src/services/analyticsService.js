// Fetch analytics data from the backend API

import {fetchAPI} from '../api/apiClient.js';
import { ANALYTICS_API } from '../config/apiConfig.js';

export async function getMonthlyPersonal() {
    return await fetchAPI (ANALYTICS_API.PERSONAL);
}

export async function getGroupSpending() {
    return await fetchAPI(ANALYTICS_API.GROUP_SPENDING);
}

export async function getGroupCategories(groupId) {
    return await fetchAPI(ANALYTICS_API.GROUP_CATEGORIES(groupId));
}

export async function getPersonalCategories() {
    return await fetchAPI(ANALYTICS_API.PERSONAL_CATEGORIES);
}

