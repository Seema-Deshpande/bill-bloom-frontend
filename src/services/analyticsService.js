import axios from 'axios'
import { ANALYTICS_API } from '../config/apiConfig.js';

export async function getMonthlyPersonal() {
    return await axios.get (ANALYTICS_API.PERSONAL);
}

export async function getGroupSpending() {
    return await axios.get(ANALYTICS_API.GROUP_SPENDING);
}

export async function getGroupCategories(groupId) {
    return await axios.get(ANALYTICS_API.GROUP_CATEGORIES(groupId));
}

export async function getPersonalCategories() {
    return await axios.get(ANALYTICS_API.PERSONAL_CATEGORIES);
}

