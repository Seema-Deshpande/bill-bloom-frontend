import apiClient from '../api/apiClient.js';
import { AI_API } from '../config/apiConfig.js';
import { handleApiError } from '../utils/handleApiError.js';

export const parseExpenseText = async (text, groupId = null) => {
    try {
        const payload = { text };
        if (groupId) payload.groupId = groupId;
        const res = await apiClient.post(AI_API.PARSE_EXPENSE, payload);
        return res.data?.data ?? null;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const analysePersonalExpenses = async () => {
    try {
        const res = await apiClient.post(AI_API.ANALYSE_PERSONAL);
        return res.data?.data ?? null;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const scanBillImage = async (image, mimeType = 'image/jpeg') => {
    try {
        const res = await apiClient.post(AI_API.SCAN_BILL, { image, mimeType });
        return res.data?.data ?? null;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};
